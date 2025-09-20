

"use client"; 

import { useState, useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

const MetaLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width="120"
        height="60"
        viewBox="0 0 120 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            .infinity-loop {
              stroke-dasharray: 240; 
              stroke-dashoffset: 240;
              animation: draw-loop 3s ease-in-out infinite;
            }

            @keyframes draw-loop {
              from {
                stroke-dashoffset: 240;
              }
              to {
                stroke-dashoffset: -240;
              }
            }
          `}
        </style>
        
        <defs>
          <linearGradient id="meta-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0062E0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C13584', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <path
          d="M 20 30 C 20 10, 40 10, 60 30 S 100 50, 100 30 S 80 10, 60 30 S 20 50, 20 30"
          stroke="url(#meta-gradient)"
          strokeOpacity="0.2"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        <path
          className="infinity-loop"
          d="M 20 30 C 20 10, 40 10, 60 30 S 100 50, 100 30 S 80 10, 60 30 S 20 50, 20 30"
          stroke="url(#meta-gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-sm font-medium text-gray-400">Generating Diagram...</p>
    </div>
  );
};


export default function HomePage() {
  const [userInput, setUserInput] = useState('');
  const [diagramType, setDiagramType] = useState('flowchart');
  const [diagramCode, setDiagramCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const render = async () => {
      const outputDiv = document.getElementById('diagram-output');
      if (outputDiv && diagramCode) {
        try {
          outputDiv.innerHTML = ''; 
          const { svg } = await mermaid.render('mermaid-graph', diagramCode);
          outputDiv.innerHTML = svg;
        } catch (e) {
          const error = e as Error;
          setErrorMessage(`Mermaid rendering error: ${error.message}`);
          if (outputDiv) outputDiv.innerHTML = ''; 
        }
      }
    };

    render();
  }, [diagramCode]);

  const generateDiagram = async () => {
    if (!userInput.trim()) {
      setErrorMessage("Please enter a description for the diagram.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setDiagramCode('');

    try {
     const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/generate-diagram';
const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userInput,
          diagram_type: diagramType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unknown error occurred.');
      }

      const data = await response.json();
      setDiagramCode(data.diagram_code);

    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDiagram = (format: 'png' | 'jpg') => {
    const outputDiv = document.getElementById('diagram-output');
    const svgElement = outputDiv?.querySelector('svg');

    if (!svgElement) {
      setErrorMessage('No diagram to download.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setErrorMessage('Could not create canvas context for download.');
        return;
      }
      
      const targetWidth = 1920; 
      const aspectRatio = img.width / img.height;
      
      canvas.width = targetWidth;
      canvas.height = targetWidth / aspectRatio;
      
      ctx.imageSmoothingQuality = 'high';

      if (format === 'jpg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = `multichange-diagram-HD.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 1.0); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.onerror = () => {
      setErrorMessage('Failed to load SVG for download.');
    };
    img.src = svgUrl;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/80 to-purple-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg/w-2/5 flex flex-col space-y-6">
          <header>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Multichange</h1>
            <p className="text-gray-400 mt-1">AI-Powered Diagram Generation</p>
          </header>

          <div>
            <label htmlFor="user-input" className="block text-sm font-medium text-gray-300 mb-2"> Describe your process</label>
            <textarea
              id="user-input"
              rows={12}
              className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe the steps, components, or relationships..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"> Select Diagram Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['flowchart', 'sequenceDiagram', 'classDiagram', 'erDiagram'].map((type) => (
                <label key={type} className="flex items-center p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/70 has-[:checked]:bg-blue-900/50 has-[:checked]:border-blue-500 transition">
                  <input
                    type="radio"
                    name="diagram-type"
                    value={type}
                    checked={diagramType === type}
                    onChange={(e) => setDiagramType(e.target.value)}
                    className="h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-300 capitalize">{type.replace('Diagram', ' Diagram')}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateDiagram}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Diagram'}
          </button>

          {errorMessage && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-sm">{errorMessage}</div>
          )}
        </div>

        <div className="w-full lg:w-3/2 flex flex-col gap-4">
            <div className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center p-4 flex-grow min-h-[400px]">
                {isLoading ? <MetaLoadingAnimation /> : (
                  <div id="diagram-output" className="w-full text-center">
                      {!diagramCode && <p className="text-gray-500">Your diagram will appear here.</p>}
                  </div>
                )}
            </div>

            {diagramCode && !isLoading && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => downloadDiagram('png')}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400/50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => downloadDiagram('jpg')}
                  className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-400/50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Download JPG
                </button>
              </div>
            )}
        </div>

      </div>
    </main>
  );
}

