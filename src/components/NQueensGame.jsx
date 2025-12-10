import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

const NQueensGame = () => {
    const [n, setN] = useState(4); // Default board size
    const [board, setBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [queensCount, setQueensCount] = useState(0);

    useEffect(() => {
        resetGame();
    }, [n]);

    const resetGame = () => {
        const newBoard = Array(n).fill().map(() => Array(n).fill(false));
        setBoard(newBoard);
        setQueensCount(0);
        setMessage('');
    };

    const isSafe = (row, col, currentBoard) => {
        // Check row and column
        for (let i = 0; i < n; i++) {
            if (currentBoard[row][i] && i !== col) return false;
            if (currentBoard[i][col] && i !== row) return false;
        }

        // Check diagonals
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (currentBoard[i][j]) {
                    if (Math.abs(row - i) === Math.abs(col - j) && (row !== i || col !== j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleCellClick = (row, col) => {
        if (message === 'Solved!') return;

        const newBoard = [...board.map(r => [...r])];
        
        if (newBoard[row][col]) {
            // Remove queen
            newBoard[row][col] = false;
            setQueensCount(prev => prev - 1);
            setMessage('');
        } else {
            // Place queen
            if (queensCount < n) {
                if (isSafe(row, col, newBoard)) {
                    newBoard[row][col] = true;
                    setQueensCount(prev => prev + 1);
                    if (queensCount + 1 === n) {
                        setMessage('Solved!');
                    }
                } else {
                    setMessage('Invalid Move! Queen is under attack.');
                    setTimeout(() => setMessage(''), 2000);
                    return; // Don't update board if invalid
                }
            } else {
                setMessage(`You can only place ${n} queens.`);
                setTimeout(() => setMessage(''), 2000);
                return;
            }
        }
        setBoard(newBoard);
    };

    return (
        <div className="nqueens-page animate-fade-in">
            <BackButton />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="section-title" style={{ color: 'var(--primary)' }}>N-Queens Puzzle</h2>
                
                <div className="glass-card game-card">
                    <div className="controls" style={{ marginBottom: '2rem' }}>
                        <label className="label" style={{ marginRight: '1rem' }}>Board Size (N):</label>
                        <select 
                            value={n} 
                            onChange={(e) => setN(parseInt(e.target.value))}
                            className="input"
                            style={{ width: 'auto', display: 'inline-block' }}
                        >
                            <option value={4}>4x4</option>
                            <option value={5}>5x5</option>
                            <option value={6}>6x6</option>
                            <option value={8}>8x8</option>
                        </select>
                        <button onClick={resetGame} className="btn-small" style={{ marginLeft: '1rem' }}>Reset</button>
                    </div>

                    <div className="game-status">
                        <p>Queens Placed: {queensCount} / {n}</p>
                        {message && <p className={`status-msg ${message === 'Solved!' ? 'success' : 'error'}`}>{message}</p>}
                    </div>

                    <div 
                        className="chessboard" 
                        style={{ 
                            gridTemplateColumns: `repeat(${n}, 1fr)`,
                            width: `${Math.min(400, n * 50)}px`,
                            height: `${Math.min(400, n * 50)}px`
                        }}
                    >
                        {board.map((row, rIndex) => (
                            row.map((hasQueen, cIndex) => (
                                <div 
                                    key={`${rIndex}-${cIndex}`}
                                    className={`chess-cell ${(rIndex + cIndex) % 2 === 0 ? 'light' : 'dark'} ${hasQueen ? 'has-queen' : ''}`}
                                    onClick={() => handleCellClick(rIndex, cIndex)}
                                >
                                    {hasQueen && '♛'}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NQueensGame;
