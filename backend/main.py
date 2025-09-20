
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Multichange AI Diagram Generator API",
    description="An API that uses Gemini to generate Mermaid.js diagrams from text.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error configuring Gemini: {e}")
    model = None

class DiagramRequest(BaseModel):
    text: str
    diagram_type: str

def create_prompt(text: str, diagram_type: str) -> str:
    """Creates an intelligent, two-step prompt to handle complex, messy input."""
    return f"""
    You are an intelligent process analyst and Mermaid.js expert. Your task is to handle complex user input by first extracting the core process steps and then rendering them into a diagram.

    **YOUR TWO-STEP PROCESS:**
    1.  **EXTRACT:** First, carefully read the entire user's text below. Identify the main sequence of actions or the user-system interaction flow. You MUST ignore all other descriptive text, headings, paragraphs, and pre-formatted code snippets. Distill the text down to a simple list of steps.
    2.  **RENDER:** Second, use ONLY the clean list of steps you extracted to generate a compact, multi-line Mermaid.js {diagram_type}.

    **CRITICAL RENDERING RULES:**
    - Your ENTIRE final output must be raw Mermaid.js code. Do NOT use markdown ```.
    - For flowcharts, use the "bending" layout rule: break long chains into multiple lines for readability.
    - For sequence diagrams, correctly identify participants (e.g., User, Frontend, Backend, API) and show the message flow between them.

    **User's Full Text (Analyze, Extract, and then Render):**
    ---
    {text}
    ---
    """

@app.post("/api/generate-diagram")
async def generate_diagram(request: DiagramRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API is not configured. Check server logs.")

    if not request.text or not request.diagram_type:
        raise HTTPException(status_code=400, detail="Text and diagram_type are required.")

    try:
        prompt = create_prompt(request.text, request.diagram_type)
        response = model.generate_content(prompt)
        
        mermaid_code = response.text.strip()
        if "```" in mermaid_code:
            mermaid_code = mermaid_code.replace("```mermaid", "").replace("```", "").strip()
        
        return {"diagram_code": mermaid_code}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the diagram: {e}")

@app.get("/")
def read_root():
    return {"status": "Multichange API is running"}

