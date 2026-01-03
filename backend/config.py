import os
from dotenv import load_dotenv

# Load .env from the same directory as this config file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

class Settings:
    PROJECT_NAME: str = "TrustShield AI"
    VERSION: str = "1.0.0"
    # Now fetching from the loaded environment variables
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GOOGLE_SAFE_BROWSING_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_KEY")

settings = Settings()
