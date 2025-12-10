import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ZenDrawing = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#15803d');
    const [brushSize, setBrushSize] = useState(5);
    const contextRef = useRef(null);

    // Soothing color palette
    const colors = [
        '#15803d', // Green
        '#0ea5e9', // Sky Blue
        '#8b5cf6', // Violet
        '#f43f5e', // Rose
        '#f59e0b', // Amber
        '#64748b', // Slate
        '#000000', // Black
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.6;
        
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const downloadArt = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'zen-art.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="zen-drawing-container">
            <div className="zen-header">
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                <h2>Zen Drawing</h2>
                <p>Express yourself freely. No judgment, just flow.</p>
            </div>

            <div className="drawing-controls">
                <div className="color-picker">
                    {colors.map((c) => (
                        <button
                            key={c}
                            className={`color-btn ${color === c ? 'active' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>
                
                <div className="brush-control">
                    <label>Brush Size:</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(parseInt(e.target.value))} 
                    />
                </div>

                <div className="action-buttons">
                    <button onClick={clearCanvas} className="action-btn clear-btn">Clear Canvas</button>
                    <button onClick={downloadArt} className="action-btn save-btn">Save Art</button>
                </div>
            </div>

            <div className="canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    className="drawing-canvas"
                />
            </div>
        </div>
    );
};

export default ZenDrawing;
