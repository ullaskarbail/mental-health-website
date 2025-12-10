import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PuzzleGame = () => {
    const [tiles, setTiles] = useState([]);
    const [isSolved, setIsSolved] = useState(false);
    const [moves, setMoves] = useState(0);

    // Initialize solved state: [1, 2, 3, 4, 5, 6, 7, 8, null]
    const solvedState = [...Array(8).keys()].map(x => x + 1).concat(null);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        let newTiles = [...solvedState];
        // Shuffle
        for (let i = newTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
        }
        
        // Ensure solvability (simplified: just reshuffle if not solvable or solved)
        // For a 3x3 grid, inversions must be even.
        while (!isSolvable(newTiles) || isGameSolved(newTiles)) {
            newTiles.sort(() => Math.random() - 0.5);
        }

        setTiles(newTiles);
        setIsSolved(false);
        setMoves(0);
    };

    const isSolvable = (arr) => {
        let inversions = 0;
        const flat = arr.filter(x => x !== null);
        for (let i = 0; i < flat.length - 1; i++) {
            for (let j = i + 1; j < flat.length; j++) {
                if (flat[i] > flat[j]) inversions++;
            }
        }
        return inversions % 2 === 0;
    };

    const isGameSolved = (currentTiles) => {
        for (let i = 0; i < solvedState.length; i++) {
            if (currentTiles[i] !== solvedState[i]) return false;
        }
        return true;
    };

    const moveTile = (index) => {
        if (isSolved) return;

        const emptyIndex = tiles.indexOf(null);
        const validMoves = [
            emptyIndex - 1, // Left
            emptyIndex + 1, // Right
            emptyIndex - 3, // Up
            emptyIndex + 3  // Down
        ];

        // Check row constraints for left/right moves
        if (emptyIndex % 3 === 0 && index === emptyIndex - 1) return; // Empty is start of row, can't move left from prev row
        if ((emptyIndex + 1) % 3 === 0 && index === emptyIndex + 1) return; // Empty is end of row, can't move right from next row

        if (validMoves.includes(index)) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(moves + 1);

            if (isGameSolved(newTiles)) {
                setIsSolved(true);
            }
        }
    };

    return (
        <div className="puzzle-container">
            <div className="puzzle-card">
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                <h2>Sliding Puzzle</h2>
                <p>Order the tiles from 1 to 8.</p>
                
                <div className="game-info">
                    <span>Moves: {moves}</span>
                    <button onClick={startNewGame} className="new-game-btn">New Game</button>
                </div>

                <div className="grid-container">
                    {tiles.map((tile, index) => (
                        <div 
                            key={index} 
                            className={`tile ${tile === null ? 'empty' : ''} ${isSolved ? 'solved' : ''}`}
                            onClick={() => tile !== null && moveTile(index)}
                        >
                            {tile}
                        </div>
                    ))}
                </div>

                {isSolved && (
                    <div className="win-message">
                        <h3>🎉 Puzzle Solved! 🎉</h3>
                        <p>Great job! You did it in {moves} moves.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PuzzleGame;
