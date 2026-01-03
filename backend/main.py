import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config
from fastapi.staticfiles import StaticFiles
# =================================================================
# 🚨 CRITICAL WINDOWS FIX
# This sets the correct Event Loop policy BEFORE the app starts.
# =================================================================
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
# =================================================================

# Import routes AFTER setting the loop policy
from api_bundle import router as api_router
app = FastAPI(title="TrustShield AI API")
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")
@app.get("/")
def root():
    return {"status": "TrustShield System Online"}

if __name__ == "__main__":
    import uvicorn
    # We run the app using the string reference "app.main:app" to enable reload
    print("🚀 Starting TrustShield Server on Windows (Proactor Loop Enabled)...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)