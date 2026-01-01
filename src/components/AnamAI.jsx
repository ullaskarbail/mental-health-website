import React, { useEffect, useRef, useState } from 'react';
import { unsafe_createClientWithApiKey } from '@anam-ai/js-sdk';

const AnamAI = ({ isOpen, onClose }) => {
    const videoRef = useRef(null);
    const [client, setClient] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && !client) {
            const apiKey = import.meta.env.VITE_ANAM_API_KEY;
            
            if (!apiKey) {
                setError("API Key missing. Please set VITE_ANAM_API_KEY in .env");
                return;
            }

            try {
                const anamClient = unsafe_createClientWithApiKey(apiKey, {
                    name: 'Cara',
                    avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18',
                    voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
                    brainType: 'ANAM_GPT_4O_MINI_V1',
                    systemPrompt: "[STYLE] Reply in natural speech without formatting. Add pauses using '...' and very occasionally a disfluency. [PERSONALITY] You are Cara, a helpful assistant.",
                });

                setClient(anamClient);
                
                // Start streaming when client is ready
                anamClient.streamToVideoElement('anam-video-element').then(() => {
                    setIsLoaded(true);
                }).catch(err => {
                    console.error("Failed to stream:", err);
                    setError("Failed to start video stream.");
                });

            } catch (err) {
                console.error("Anam Client Init Error:", err);
                setError(err.message);
            }
        }

        // Cleanup function
        return () => {
            if (client) {
                client.stopStreaming();
                setClient(null);
                setIsLoaded(false);
            }
        };
    }, [isOpen]);

    // Handle closing
    const handleClose = () => {
        if (client) {
            client.stopStreaming();
            setClient(null);
            setIsLoaded(false);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="anam-overlay">
            <div className="anam-modal">
                <div className="anam-header">
                    <h3>AI Counsellor (Cara)</h3>
                    <button onClick={handleClose} className="close-btn">✕</button>
                </div>
                
                <div className="anam-content">
                    {error ? (
                        <div className="error-message">
                            <p>⚠️ {error}</p>
                            <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>
                                Make sure you have a valid API Key in your .env file:
                                <br/>
                                <code>VITE_ANAM_API_KEY=your_key_here</code>
                            </p>
                        </div>
                    ) : (
                        <div className="video-container">
                            {!isLoaded && <div className="loading-spinner">Connecting to Cara...</div>}
                            <video 
                                id="anam-video-element" 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                style={{ width: '100%', height: '100%', borderRadius: '0.5rem', display: isLoaded ? 'block' : 'none' }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="anam-footer">
                    <p>Speak clearly to interact with Cara.</p>
                </div>
            </div>
        </div>
    );
};

export default AnamAI;
