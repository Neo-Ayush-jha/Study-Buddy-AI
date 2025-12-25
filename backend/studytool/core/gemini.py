from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set. Add it to your .env file.")

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

def ask_gemini(prompt: str) -> str:
    """
    Send prompt to Gemini and return text response.
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text
