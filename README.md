Here is a professional, hackathon-ready `README.md` file. You can copy-paste this directly into your GitHub repository.

---

# 🛡️ TrustShield AI: Multi-Modal Fraud Defense System

> **Fighting Digital Deception with Forensic AI, Computer Vision, and Automated Intelligence.**

## 📖 Overview

**TrustShield AI** is an advanced security platform designed to detect "Social Engineering" attacks—scams that manipulate humans rather than machines. Unlike traditional antivirus software that scans for malware signatures, TrustShield uses **Multi-Modal AI** (Text, Vision, and Metadata analysis) to identify phishing, forged documents, and fake payment proofs in real-time.

It acts as a **Cyber Security Intelligence Unit**, connecting the dots between a suspicious message, a phishing link, and a manipulated screenshot.

---

## 🚩 Problem Statement

Fraud has evolved. Scammers now use:

1. **Pixel-Perfect Phishing:** Fake banking sites that bypass traditional filters.
2. **Digital Forgery:** Manipulated screenshots to fake payments (Retail Fraud).
3. **Conversational Traps:** AI-generated scripts to lure victims via WhatsApp/SMS.

Existing tools operate in silos (checking *only* a URL or *only* a file). There is no unified system that "interrogates" the context like a human forensic analyst—until now.

---

## ✨ Key Features & "Wow" Factors

### 1. 🕵️ Forensic Document Analysis ("The Digital Lie Detector")

We don't just read the text; we analyze the pixels.

* **ELA (Error Level Analysis):** Re-compresses images to highlight "alien pixels" (edits) that don't match the original compression artifacts.
* **Metadata Hunter:** Scans for hidden EXIF data to detect editing software like Photoshop, Canva, or GIMP.
* **Gemini Vision Audit:** Checks for visual inconsistencies (e.g., "The font for the Amount is sharper than the background noise").

### 2. 💸 Payment "Time Police" (Retail Fraud Guard)

Stops fake payment screenshot scams commonly used against shopkeepers.

* **Time Travel Check:** Extracts dates from screenshots and cross-references them with the real-world date. If a screenshot claims to be from "Today" but uses a UI layout from 2020, it is flagged.
* **UPI Validation:** Enforces strict regex checks for 12-digit UPI transaction IDs.

### 3. 🌐 Intelligent URL Sandbox

We visit the link so you don't have to.

* **Playwright Sandbox:** Opens suspicious links in a headless, isolated browser to capture live screenshots.
* **Visual Classification (CLIP):** Uses OpenAI's CLIP model to "see" the website layout. It detects if a site *looks* like a bank but is hosted on a random domain.
* **Threat Intel:** Cross-references with Google Safe Browsing API.

### 4. 💬 Context-Aware Message Scanning

* **Hybrid NLP:** Combines **BERT** (for rapid spam syntax detection) with **Gemini Pro** (for deep intent analysis) to catch "CEO Fraud" and "Family Emergency" scams.

---

## ⚙️ Technology Stack

### Backend (Python)

* **Framework:** FastAPI, Uvicorn.
* **LLM/GenAI:** Google Gemini 1.5 Pro via `google-generativeai`.
* **Computer Vision:** OpenCV (ELA), OpenAI CLIP (Layouts), EasyOCR (Text Extraction).
* **NLP:** Spacy (Entity Extraction), Transformers (BERT).
* **Browser Automation:** Playwright.
* **Vector DB:** ChromaDB (Scam template matching).

### Frontend (React)

* **Framework:** React + Vite.
* **Styling:** TailwindCSS, Shadcn UI.
* **State Management:** TanStack Query.

---

## 🚀 Installation & Setup

### Prerequisites

* Python 3.9+
* Node.js & npm
* Google Gemini API Key

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/trustshield-ai.git
cd trustshield-ai

# Install Python dependencies
pip install fastapi uvicorn pydantic python-whois requests numpy pandas opencv-python torch easyocr spacy langdetect Pillow transformers google-generativeai paddlepaddle paddleocr scikit-learn chromadb sentence-transformers playwright python-dotenv python-dateutil python-multipart

# Download NLP Models
python -m spacy download en_core_web_sm

# Install Browser Binaries
playwright install chromium

# Configuration
# Create a .env file or config.py with your keys:
# GEMINI_API_KEY="your_key_here"
# GOOGLE_SAFE_BROWSING_KEY="your_key_here"

# Run the Server
python backend/main.py

```

> **Note:** Windows users are automatically supported via the `WindowsProactorEventLoopPolicy` fix included in `main.py`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev

```

---

## 📸 Architecture & Workflow

1. **User Input:** Uploads a file or pastes a URL.
2. **Orchestrator:** FastAPI routes the request to `unified_services.py`.
3. **Parallel Processing:**
* *Visuals* go to CLIP and OpenCV.
* *Text* goes to BERT and Spacy.
* *URLs* go to Playwright and Google Safe Browsing.


4. **Synthesis:** All extracted signals are fed into **Gemini Pro** for a final forensic verdict.
5. **Output:** JSON response rendered by React frontend.

---

## 🔮 Future Roadmap

* **Audio Fraud Detection:** Analyzing voice notes for "Deepfake" signatures.
* **Browser Extension:** Real-time overlay to block links before clicking.
* **Blockchain Reputation:** Decentralized ledger for confirmed scammer UPI IDs.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

create a .env file and enter your api keys

GEMINI_API_KEY=YOUR_KEY
GOOGLE_SAFE_BROWSING_KEY=YOUR_KEY
