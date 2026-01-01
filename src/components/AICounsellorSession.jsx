import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { unsafe_createClientWithApiKey } from '@anam-ai/js-sdk';

const AICounsellorSession = () => {
    const videoRef = useRef(null);
    const [client, setClient] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { avatarId } = useParams();
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || 'AI Counsellor';
    const voiceId = searchParams.get('voiceId') || '6bfbe25a-979d-40f3-a92b-5394170af54b'; // Default to Cara's voice

    useEffect(() => {
        const apiKey = import.meta.env.VITE_ANAM_API_KEY;
        
        if (!apiKey) {
            setError("API Key missing. Please set VITE_ANAM_API_KEY in .env");
            return;
        }

        let anamClient = null;

        try {
            anamClient = unsafe_createClientWithApiKey(apiKey, {
                name: name,
                avatarId: avatarId,
                voiceId: voiceId,
                brainType: 'ANAM_GPT_4O_MINI_V1',
                systemPrompt: `[STYLE] Reply in natural speech without formatting. Add pauses using '...' and very occasionally a disfluency. [PERSONALITY] You are ${name}, a helpful assistant.`,
            });

            setClient(anamClient);
            
            // Start streaming when client is ready
            anamClient.streamToVideoElement('anam-video-element-full').then(() => {
                setIsLoaded(true);
            }).catch(err => {
                console.error("Failed to stream:", err);
                setError("Failed to start video stream.");
            });

        } catch (err) {
            console.error("Anam Client Init Error:", err);
            setError(err.message);
        }

        // Cleanup function
        return () => {
            if (anamClient) {
                anamClient.stopStreaming();
            }
        };
    }, [avatarId, name, voiceId]);

    const handleEndSession = () => {
        if (client) {
            client.stopStreaming();
        }
        navigate('/counsellors');
    };

    return (
        <div className="ai-session-page animate-fade-in">
            <div className="ai-session-container">
                <div className="ai-session-header">
                    <h2>AI Counsellor Session</h2>
                    <button onClick={handleEndSession} className="end-session-btn">
                        End Session
                    </button>
                </div>

                <div className="ai-video-wrapper">
                    {error ? (
                        <div className="error-message-large">
                            <h3>⚠️ Connection Error</h3>
                            <p>{error}</p>
                            <button onClick={() => navigate('/counsellors')} className="btn-outline">Go Back</button>
                        </div>
                    ) : (
                        <>
                            {!isLoaded && (
                                <div className="loading-overlay">
                                    <div className="spinner"></div>
                                    <p>Connecting to Cara...</p>
                                </div>
                            )}
                            <video 
                                id="anam-video-element-full" 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="ai-video-element"
                            />
                        </>
                    )}
                </div>
                
                <div className="ai-session-controls">
                    <p>Microphone is active. Speak naturally to Cara.</p>
                </div>
            </div>
        </div>
    );
};

export default AICounsellorSession;
