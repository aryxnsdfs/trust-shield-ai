import os
from dotenv import load_dotenv

# Load .env from the same directory as this config file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

class Settings:
    PROJECT_NAME: str = "TrustShield AI"
    VERSION: str = "1.0.0"
    GEMINI_API_KEY = "AIzaSyAtLDOw3f8yaTyOkxjkGRXVqz1_Hl68kJ0"
    GOOGLE_SAFE_BROWSING_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_KEY")

settings = Settings()