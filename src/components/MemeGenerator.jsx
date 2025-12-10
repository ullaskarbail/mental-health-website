import React, { useState, useRef, useEffect } from 'react';
import BackButton from './BackButton';

const MemeGenerator = () => {
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [image, setImage] = useState(null);
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match image
            // Limit max width for display purposes
            const maxWidth = 500;
            const scale = Math.min(1, maxWidth / image.width);
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;

            // Draw image
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Configure text style
            ctx.font = `bold ${canvas.width / 10}px Impact`;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = canvas.width / 150;
            ctx.textAlign = 'center';

            // Draw Top Text
            ctx.textBaseline = 'top';
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, canvas.height * 0.05);
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, canvas.height * 0.05);

            // Draw Bottom Text
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height * 0.95);
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height * 0.95);
        }
    }, [image, topText, bottomText]);

    const handleDownload = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <div className="meme-page animate-fade-in">
            <BackButton />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="section-title" style={{ color: 'var(--primary)' }}>Meme Generator</h2>
                
                <div className="meme-card glass-card">
                    <div className="meme-controls">
                        <div className="form-group">
                            <label className="label">Upload Image</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />
                        </div>
                        <div className="form-group">
                            <label className="label">Top Text</label>
                            <input 
                                type="text" 
                                className="input" 
                                placeholder="Top Text" 
                                value={topText} 
                                onChange={(e) => setTopText(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Bottom Text</label>
                            <input 
                                type="text" 
                                className="input" 
                                placeholder="Bottom Text" 
                                value={bottomText} 
                                onChange={(e) => setBottomText(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="meme-preview">
                        {image ? (
                            <canvas ref={canvasRef} className="meme-canvas" />
                        ) : (
                            <div className="placeholder-box">
                                <p>Upload an image to start</p>
                            </div>
                        )}
                    </div>

                    {image && (
                        <button onClick={handleDownload} className="btn" style={{ marginTop: '2rem' }}>
                            Download Meme
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemeGenerator;
