import { useState, useEffect, useRef } from 'react';

const BubblePopGame = ({ onClose }) => {
    const [bubbles, setBubbles] = useState([]);
    const audioCtxRef = useRef(null);

    useEffect(() => {
        // Initialize AudioContext
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

        // Generate initial bubbles
        const initialBubbles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            popped: false,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            size: Math.random() * 40 + 40 // 40px to 80px
        }));
        setBubbles(initialBubbles);

        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const playPopSound = () => {
        if (!audioCtxRef.current) return;

        const ctx = audioCtxRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        // Random frequency between 400Hz and 800Hz for variety
        oscillator.frequency.setValueAtTime(400 + Math.random() * 400, ctx.currentTime);
        // Frequency drop for "pop" effect
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    };

    const popBubble = (id) => {
        playPopSound();
        setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    };

    const resetGame = () => {
        setBubbles(prev => prev.map(b => ({ ...b, popped: false, color: `hsl(${Math.random() * 360}, 70%, 60%)` })));
    };

    return (
        <div className="game-overlay">
            <div className="game-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Bubble Pop!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Click bubbles to pop them and relieve stress.</p>

                <div className="bubble-grid">
                    {bubbles.map(bubble => (
                        <div
                            key={bubble.id}
                            className={`bubble ${bubble.popped ? 'popped' : ''}`}
                            style={{
                                backgroundColor: bubble.color,
                                width: `${bubble.size}px`,
                                height: `${bubble.size}px`
                            }}
                            onClick={() => !bubble.popped && popBubble(bubble.id)}
                        />
                    ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button className="btn" onClick={resetGame} style={{ width: 'auto' }}>Reset Bubbles</button>
                </div>
            </div>
            <style>{`
                .game-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .game-container {
                    background: white;
                    padding: 2rem;
                    border-radius: 2rem;
                    text-align: center;
                    max-width: 600px;
                    width: 90%;
                    position: relative;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: var(--text-muted);
                }
                .bubble-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: center;
                    min-height: 300px;
                    align-content: center;
                }
                .bubble {
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.1s, opacity 0.2s;
                    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1), 2px 2px 5px rgba(0,0,0,0.1);
                }
                .bubble:active {
                    transform: scale(0.9);
                }
                .bubble.popped {
                    transform: scale(1.2);
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default BubblePopGame;
