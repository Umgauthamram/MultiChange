Multichange: AI-Powered Diagram Generator
A smart web application that transforms your text descriptions into beautiful, high-definition diagrams. Describe your process, and let our intelligent AI handle the visualization.

<a href="https://multi-change.vercel.app" target="_blank">
<img src="https://www.google.com/url?sa=E&source=gmail&q=https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge%26logo=vercel" alt="Live Demo">
</a>

The Purpose
In a world driven by complex processes and systems, clear communication is key. Standard diagramming tools are often manual, time-consuming, and require expertise. Multichange was built to solve this problem by leveraging the power of generative AI. Our goal is to make diagramming effortless, intelligent, and accessible to everyone. Simply describe what you want to visualize, and Multichange will create a clean, well-structured, and aesthetically pleasing diagram for you.

How Our AI Works: More Than a Simple Converter
The core of Multichange is a sophisticated AI prompt-engineering strategy designed to be both intelligent and resilient. It doesn't just pass your text to an AI; it guides the AI to think and act like a professional data visualizer.

This is achieved through a two-step "Extract and Render" process handled by our Python backend:

Step 1: Intelligent Extraction
The AI first reads the entire user input, no matter how messy. It's specifically instructed to identify and extract only the core process steps. It intelligently ignores:

Descriptive paragraphs and headings.

Pre-formatted code snippets or examples.

Explanatory text that isn't part of the actual flow.

This allows a user to paste a full project plan, and the AI will find the relevant process within it.

Step 2: Smart Rendering & Layout
Using only the clean, extracted steps, the AI generates the Mermaid.js code. During this phase, it follows a strict set of rendering rules:

The "Bending" Layout Rule: For any flowchart with more than 4-5 nodes, the AI is commanded to break the chain into multiple lines. This prevents long, unreadable diagrams and creates the compact, "bending" layouts that are easy to follow.

Context-Aware Structuring: It correctly identifies participants in sequence diagrams (e.g., User, Frontend, Backend) and structures class or ER diagrams logically.

Syntax Purity: The AI is strictly forbidden from outputting Markdown or any other text, ensuring the output is always clean, raw Mermaid.js code.

This dual-process makes our AI robust, user-friendly, and capable of producing high-quality diagrams from a wide range of inputs.

Key Features
AI-Powered Generation: Utilizes the Google Gemini model for intelligent diagram creation.

Multiple Diagram Types: Supports Flowcharts, Sequence Diagrams, Class Diagrams, and ER Diagrams.

Smart Layouts: Automatically formats lengthy flowcharts into compact, multi-line structures.

Full HD Export: Download your diagrams as crisp, high-resolution PNG or JPG files.

Modern Dark UI: A sleek, gradient-based dark theme that's easy on the eyes.

Live Rendering: See your diagram appear instantly as the AI completes its work.

Tech Stack & Architecture
Our architecture is a modern, decoupled system with a Next.js frontend and a Python backend, hosted on separate, specialized platforms for optimal performance.

Category

Technology

Frontend



Backend



AI Model



Deployment

(Frontend)  (Backend)

graph TD
    subgraph "User's Browser"
        A[Next.js Frontend on Vercel]
    end

    subgraph "Cloud Services"
        B[Python Backend on Render]
        C[Google Gemini API]
    end

    A -- "POST Request (User Prompt)" --> B;
    B -- "Analyzes & Creates Prompt" --> C;
    C -- "Generates Mermaid Code" --> B;
    B -- "Returns Mermaid Code" --> A;

Local Setup & Installation
To run this project on your local machine, follow these steps.

Prerequisites
Node.js (v18 or later)

Python (v3.9 or later)

Git

1. Clone the Repository
git clone [https://github.com/Umgauthamram/MultiChange.git](https://github.com/Umgauthamram/MultiChange.git)
cd MultiChange

2. Backend Setup
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your API key
# Example: GEMINI_API_KEY="YOUR_SECRET_KEY_HERE"
echo 'GEMINI_API_KEY="YOUR_SECRET_KEY_HERE"' > .env

# Run the backend server
uvicorn main:app --reload

The backend will be running at http://1.0.0.1:8000.

3. Frontend Setup
Open a new terminal window.

# Navigate to the frontend directory
cd frontend-next

# Install dependencies
npm install

# Run the frontend development server
npm run dev

The frontend will be running at in local. http://localhost:3000.