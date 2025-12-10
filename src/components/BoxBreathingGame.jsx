import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BoxBreathingGame = ({ onClose }) => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('GetReady'); // Start with neutral phase
    const [timeLeft, setTimeLeft] = useState(4);
    const [instruction, setInstruction] = useState('Get Ready');

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        if (phase === 'GetReady') {
            // Short delay to ensure initial render happens at scale 1
            const timeout = setTimeout(() => {
                setPhase('Inhale');
                setInstruction('Breathe In');
            }, 100);
            return () => clearTimeout(timeout);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    // Transition to next phase
                    switch (phase) {
                        case 'Inhale':
                            setPhase('Hold-In');
                            setInstruction('Hold');
                            return 4;
                        case 'Hold-In':
                            setPhase('Exhale');
                            setInstruction('Breathe Out');
                            return 4;
                        case 'Exhale':
                            setPhase('Hold-Out');
                            setInstruction('Hold');
                            return 4;
                        case 'Hold-Out':
                            setPhase('Inhale');
                            setInstruction('Breathe In');
                            return 4;
                        default:
                            return 4;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase]);

    return (
        <div className="game-overlay">
            <div className="game-container">
                <button className="close-btn" onClick={handleClose}>×</button>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Box Breathing</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Follow the circle to relax your mind.</p>

                <div className="breathing-circle-container">
                    <div className={`breathing-circle ${phase.toLowerCase()}`}>
                        <div className="instruction-text">
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{instruction}</div>
                            <div style={{ fontSize: '1rem' }}>{timeLeft}s</div>
                        </div>
                    </div>
                </div>

                <div className="phase-indicator">
                    <div className={`dot ${phase === 'Inhale' ? 'active' : ''}`}>Inhale</div>
                    <div className={`dot ${phase === 'Hold-In' ? 'active' : ''}`}>Hold</div>
                    <div className={`dot ${phase === 'Exhale' ? 'active' : ''}`}>Exhale</div>
                    <div className={`dot ${phase === 'Hold-Out' ? 'active' : ''}`}>Hold</div>
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
                    max-width: 500px;
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
                .breathing-circle-container {
                    height: 300px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .breathing-circle {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    background: var(--primary);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    transition: all 4s ease-in-out;
                    box-shadow: 0 0 20px rgba(21, 128, 61, 0.3);
                }
                .breathing-circle.inhale {
                    transform: scale(1.5);
                }
                .breathing-circle.hold-in {
                    transform: scale(1.5);
                }
                .breathing-circle.exhale {
                    transform: scale(1);
                }
                .breathing-circle.hold-out {
                    transform: scale(1);
                }
                .breathing-circle.getready {
                    transform: scale(1);
                }
                .phase-indicator {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 1rem;
                }
                .dot {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: all 0.3s;
                }
                .dot.active {
                    background: var(--primary);
                    color: white;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default BoxBreathingGame;