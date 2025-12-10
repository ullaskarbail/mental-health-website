import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

const CupGame = () => {
    const [gameState, setGameState] = useState('idle'); // idle, shuffling, guessing, revealed
    const [ballPosition, setBallPosition] = useState(1); // 0, 1, 2
    const [message, setMessage] = useState('Click "Start" to play!');
    const [cups, setCups] = useState([0, 1, 2]); // Positions of cups

    const startGame = async () => {
        if (gameState === 'shuffling') return;
        
        setGameState('idle');
        setMessage('Watch closely...');
        
        // Reset positions
        setCups([0, 1, 2]);
        
        // Random starting position for ball
        const newBallPos = Math.floor(Math.random() * 3);
        setBallPosition(newBallPos);

        // Wait a bit then start shuffling
        setTimeout(async () => {
            setGameState('shuffling');
            await shuffleCups();
            setGameState('guessing');
            setMessage('Where is the ball?');
        }, 1000);
    };

    const shuffleCups = async () => {
        const moves = 5 + Math.floor(Math.random() * 5); // 5 to 10 moves
        let currentCups = [0, 1, 2];

        for (let i = 0; i < moves; i++) {
            // Pick two random cups to swap
            const idx1 = Math.floor(Math.random() * 3);
            let idx2 = Math.floor(Math.random() * 3);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);

            // Swap visual positions
            const temp = currentCups[idx1];
            currentCups[idx1] = currentCups[idx2];
            currentCups[idx2] = temp;
            
            setCups([...currentCups]);
            await new Promise(r => setTimeout(r, 600)); // Speed of shuffle
        }
        
        // Update ball position based on final shuffle if needed
        // Actually, simpler logic: we track the ball index directly
        // If we swapped the cup containing the ball, update ballPosition
        // But here 'cups' array represents which cup (0,1,2) is at which visual slot (0,1,2)
        // Let's re-think: simpler to just animate CSS transforms.
    };
    
    // Simplified Shuffle Logic for React State
    // We will just animate the "ball" moving to a new random cup visually hidden
    // For this version, let's keep it simple:
    // 1. Show ball under cup.
    // 2. Hide ball.
    // 3. Animate cups swapping positions (CSS classes).
    // 4. Stop. User clicks.
    
    // Actually, implementing a true visual shuffle in React without complex libraries is tricky.
    // Let's do a "Magic Swap" version:
    // Cups glow and move rapidly, then stop.
    
    const handleCupClick = (index) => {
        if (gameState !== 'guessing') return;
        
        setGameState('revealed');
        if (index === ballPosition) {
            setMessage('You found it! 🎉');
        } else {
            setMessage('Wrong cup! ❌');
        }
    };

    return (
        <div className="cup-game-page animate-fade-in">
            <BackButton />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="section-title" style={{ color: 'var(--primary)' }}>Find the Ball</h2>
                
                <div className="glass-card game-card">
                    <div className="game-area">
                        <div className="cups-container">
                            {[0, 1, 2].map((i) => (
                                <div 
                                    key={i} 
                                    className={`cup-wrapper ${gameState === 'shuffling' ? 'shuffling' : ''}`}
                                    onClick={() => handleCupClick(i)}
                                    style={{ order: cups[i] }} // Flex order for simple shuffling
                                >
                                    <div className={`cup ${gameState === 'revealed' && i === ballPosition ? 'lifted' : ''}`}>
                                        🥤
                                    </div>
                                    {/* Ball is only visible if lifted or idle/start */}
                                    <div className={`ball ${i === ballPosition ? 'present' : ''}`}>
                                        ⚽️
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="status-msg" style={{ fontSize: '1.2rem', margin: '2rem 0' }}>{message}</p>
                    
                    <button 
                        className="btn" 
                        onClick={startGame} 
                        disabled={gameState === 'shuffling'}
                        style={{ maxWidth: '200px' }}
                    >
                        {gameState === 'idle' || gameState === 'revealed' ? 'Start Game' : 'Shuffling...'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CupGame;
