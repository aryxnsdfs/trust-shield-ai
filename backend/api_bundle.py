from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from datetime import datetime
import shutil
import os
import json
import whois
import asyncio

import config as settings
import unified_services as services
router = APIRouter()
import mimetypes
# --- SHARED MODELS & DATA ---
# --- GLOBAL RAM STORAGE (Persists while server runs) ---
GLOBAL_SCAN_HISTORY = []

def log_scan(scan_type, verdict, details):
    entry = {
        "id": len(GLOBAL_SCAN_HISTORY) + 1,
        "type": scan_type,
        "verdict": verdict,
        # REMOVED: "score": score,
        "timestamp": str(datetime.now().strftime("%H:%M:%S")),
        "details": details
    }
    GLOBAL_SCAN_HISTORY.insert(0, entry)
    
class TransactionRequest(BaseModel):
    amount: float
    recipient: str
    timestamp: str = str(datetime.now())

user_session = {
    "last_message": None,
    "last_link_scan": None,
    "current_payment": None
}

@router.post("/scan")
@router.post("/scan")
async def scan_content(text: str = Form(None), file: UploadFile = File(None)):
    # 1. INITIALIZATION (Fixes UnboundLocalError)
    final_text = text or ""
    source_type = "text_input"
    file_payload = None

    # 2. File Handling (Multimodal + OCR Fallback)
    if file:
        try:
            content_type = file.content_type or "application/octet-stream"
            image_bytes = await file.read()
            
            if len(image_bytes) > 0:
                # Prepare blob for Gemini (Works for BOTH Images and PDFs)
                file_payload = {"mime_type": content_type, "data": image_bytes}
                source_type = "document" if "pdf" in content_type else "screenshot"

                # OPTIONAL: Run Local OCR only if it's an IMAGE
                if "image" in content_type:
                    try:
                        ocr_text = services.extract_text_from_image(image_bytes)
                        # Safely append OCR text
                        final_text = f"{final_text}\n[OCR]: {ocr_text}" if final_text else ocr_text
                    except:
                        pass # Ignore OCR errors, rely on Gemini Vision
        except Exception as e:
            print(f"File Read Error: {e}")

    # Allow empty text if a file is present (Gemini will read the file)
    if not final_text and not file_payload:
        raise HTTPException(status_code=400, detail="No content found to analyze.")

    # 3. Technical Analysis
    lang = services.detect_language(final_text)
    spam_analysis = services.get_spam_probability(final_text)
    entities = services.extract_entities(final_text)

    # Gemini Analysis
    context_payload = {
        "text": final_text[:2000],
        "source_type": source_type,
        "spam_score": spam_analysis['score'], 
        "entities": [e['text'] for e in entities]
    }
    
    ai_response_raw = services.get_safety_verdict(context_payload, file_payload)

    try:
        clean_json = ai_response_raw.replace("```json", "").replace("```", "")
        final_response = json.loads(clean_json)
        final_response["raw_text"] = final_text
    except:
        final_response = {
            "verdict": "ERROR",
            "is_safe": False,
            "explanation": "AI Output Parsing Failed",
            "raw_text": final_text
        }

    # Session & Logging (No Score)
    user_session["last_message"] = {
        "text": final_text[:100], 
        "verdict": final_response.get("verdict", "UNKNOWN"),
        "timestamp": str(datetime.now())
    }
    log_scan("Message", final_response["verdict"], final_text[:50] + "...")

    return final_response
  
@router.post("/analyze-payment")
async def analyze_payment(
    amount: str = Form("0"),  # Default to "0" if disabled/empty
    recipient: str = Form(""), # Default to empty if disabled
    user_query: str = Form(""), # New optional field
    file: UploadFile = File(None)
):
    # Convert amount safely
    try:
        amt_float = float(amount) if amount else 0.0
    except:
        amt_float = 0.0

    file_bytes = await file.read() if file else None

    # --- CROSS-MODULE INTELLIGENCE (Dynamic Memory) ---
    # We check if the user previously scanned a dangerous message or link in this session.
    context_note = ""
    
    # 1. Check for previous dangerous messages
    last_msg = user_session.get("last_message")
    if last_msg and last_msg.get("verdict") == "DANGEROUS":
        context_note += f" [SYSTEM ALERT: User previously scanned a DANGEROUS message: '{last_msg.get('text', '')}']"
    
    # 2. Check for previous risky links
    last_link = user_session.get("last_link_scan")
    if last_link and last_link.get("verdict") != "SAFE":
        context_note += f" [SYSTEM ALERT: User visited a RISKY URL: {last_link.get('url', '')}]"

    # 3. Inject context into the query so Gemini knows the history
    full_query = f"{user_query} {context_note}".strip()

    # Call the service
    analysis = services.analyze_payment_evidence(
        amount=amt_float, 
        recipient=recipient, 
        file_bytes=file_bytes,
        user_query=full_query
    )
    # Log without score
    log_scan("Payment", analysis.get("verdict", "UNKNOWN"), f"₹{amount} to {recipient}")
    
    return {
        "status": "analyzed",
        "data": analysis,
        "input": {"has_file": bool(file), "query": user_query}
    }
@router.get("/safety-report")
async def get_safety_report():
    analysis = services.analyze_fraud_chain(user_session)
    return analysis

# FIND THE 'scan_url' ROUTE AND REPLACE IT
# FIND AND REPLACE 'scan_url' IN backend/api_bundle.py

# FIND THE 'scan_url' ROUTE AND REPLACE IT ENTIRELY

# FIND THE 'scan_url' ROUTE AND REPLACE IT ENTIRELY

@router.post("/scan-url")
async def scan_url(url: str):
    # HELPER: Whois
    def get_whois_fast(u):
        try:
            w = whois.whois(u)
            return {"creation_date": str(w.creation_date), "org": w.org}
        except:
            return {"error": "Hidden"}

    # --- STEP 1: GATHER INTELLIGENCE (PARALLEL) ---
    # We execute Browser, Safe Browsing, and Whois ALL AT ONCE
    task_safe = asyncio.to_thread(services.check_google_safe_browsing, url)
    task_whois = asyncio.to_thread(get_whois_fast, url)
    task_browser = services.scan_url_dynamic(url)

    # Wait for the browser (the longest task)
    safe_browsing, domain_info, scan_result = await asyncio.gather(
        task_safe, task_whois, task_browser
    )

    if scan_result.get("error") and not scan_result.get("screenshot"):
        raise HTTPException(status_code=400, detail=f"Scan Failed: {scan_result['error']}")

    screenshot_path = f"static/{scan_result['screenshot']}"

    # --- STEP 2: ANALYZE INTELLIGENCE (PARALLEL) ---
    # We execute Visual AI (CLIP) and Text AI (Gemini) AT THE SAME TIME
    
    # Task A: CLIP (Visual Layout)
    task_clip = asyncio.to_thread(services.analyze_layout_category, screenshot_path)

    # Task B: Gemini (Forensics)
    # Note: We pass "Pending" for visual type to avoid waiting for CLIP. 
    # Gemini relies on the TEXT content more than the visual label here.
    prompt_context = {
        "url": url,
        "final_domain": scan_result.get('final_domain'),
        "visual_type": "Analyzed Separately", 
        "domain_age": domain_info.get('creation_date', 'Unknown'),
        "safe_browsing_status": safe_browsing,
        "links_analysis": scan_result.get('links_found', [])
    }
    task_gemini = asyncio.to_thread(services.get_url_verdict, prompt_context)
    

    # Wait for both AI models
    visual_ai, gemini_verdict_raw = await asyncio.gather(task_clip, task_gemini)

    try:
        gemini_data = json.loads(gemini_verdict_raw.replace("```json", "").replace("```", ""))
    except:
        gemini_data = {"verdict": "ERROR", "risk_score": 0}

    # Now safely update session
    user_session["last_link_scan"] = {
        "url": url,
        "risk_score": gemini_data.get("risk_score", 0),
        "verdict": gemini_data.get("verdict", "UNKNOWN")
    }
    
    log_scan("URL", gemini_data.get("verdict", "UNKNOWN"), url)

    return {
        "verdict": gemini_data.get("verdict"),
        "screenshot_url": f"http://localhost:8000/{screenshot_path}",
        "visual_ai": visual_ai,
        "gemini_analysis": gemini_data 
    }
import mimetypes # Ensure this is imported at top of file

@router.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...), 
    user_query: str = Form("")
):
    # 0. Save file locally
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. Read Bytes
    file.file.seek(0)
    file_bytes = await file.read()
    mime_type = file.content_type or "application/octet-stream"

    # 3. FORENSIC PIPELINE
    signature_threat = services.scan_malware_signatures(file_bytes)
    metadata_status = services.check_metadata_tampering(file_bytes)
    
    ela_result = {"tamper_score": 0, "heatmap_url": None, "is_suspicious": False}
    if mime_type.startswith("image/"):
        ela_result = services.perform_ela(file_location)

    # 4. GEMINI ANALYSIS
    prompt_context = {
        "filename": file.filename,
        "file_type": mime_type,
        "metadata_check": metadata_status, # Passed directly to AI
        "tamper_score": ela_result['tamper_score'],
        "signature_scan": signature_threat if signature_threat else "Clean"
    }

    gemini_verdict_raw = services.get_document_verdict(
        prompt_context, 
        image_bytes=file_bytes, 
        mime_type=mime_type,
        user_query=user_query
    )

    try:
        gemini_data = json.loads(gemini_verdict_raw.replace("```json", "").replace("```", ""))
        
        # 5. FINAL VERDICT AGGREGATION (Binary Logic)
        final_verdict = gemini_data.get("verdict", "INCONCLUSIVE")
        is_tampered = gemini_data.get("is_tampered", False)

        # Hard Overrides
        if signature_threat:
            final_verdict = "MALICIOUS"
            is_tampered = True
        elif "CRITICAL" in metadata_status:
             final_verdict = "TAMPERED"
             is_tampered = True
             gemini_data["primary_evidence"] = f"Metadata confirms editing: {metadata_status}"

        # If ELA is extremely high (>90), force check
        if ela_result['tamper_score'] > 90 and not is_tampered:
             final_verdict = "SUSPICIOUS"
             gemini_data["primary_evidence"] = "High Error Level Analysis (ELA) detected pixel manipulation."
            
    except:
        final_verdict = "ERROR"
        is_tampered = False
        gemini_data = {"primary_evidence": "Analysis Failed"}

    log_scan("Document", final_verdict, file.filename)

    return {
        "verdict": final_verdict,
        "is_tampered": is_tampered,
        "forensics": {
            "metadata_status": metadata_status,
            "ela_heatmap": ela_result['heatmap_url'],
            "malware_scan": signature_threat or "Clean"
        },
        "ai_analysis": gemini_data
    }
@router.get("/overview-stats")
async def get_overview_stats():
    total = len(GLOBAL_SCAN_HISTORY)
    if total == 0:
        return {
            "total_scans": 0, "threats_detected": 0, "safe_scans": 0,
            "pie_data": [1, 0, 0], "recent_activity": []
        }

    # Count based on VERDICTS
    threats = sum(1 for x in GLOBAL_SCAN_HISTORY if x["verdict"] in ["MALICIOUS", "TAMPERED", "FAKE", "SPAM", "PHISHING"])
    suspicious = sum(1 for x in GLOBAL_SCAN_HISTORY if x["verdict"] in ["SUSPICIOUS", "CAUTION", "HIGH RISK"])
    safe = sum(1 for x in GLOBAL_SCAN_HISTORY if x["verdict"] in ["SAFE", "LEGIT", "REAL", "NORMAL"])

    return {
        "total_scans": total,
        "threats_detected": threats, 
        "safe_scans": safe,          
        "pie_data": [safe, suspicious, threats],
        "recent_activity": GLOBAL_SCAN_HISTORY[:10]
    }