import React, { useState, useEffect, useRef } from 'react';
import BackButton from './BackButton';

const ROWS = 15;
const COLS = 20;

const PathfindingGame = () => {
    const [grid, setGrid] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('wall'); // 'wall', 'start', 'end'
    const [startNode, setStartNode] = useState({ r: 2, c: 2 });
    const [endNode, setEndNode] = useState({ r: 12, c: 17 });

    useEffect(() => {
        resetGrid();
    }, []);

    const resetGrid = () => {
        const newGrid = [];
        for (let r = 0; r < ROWS; r++) {
            const row = [];
            for (let c = 0; c < COLS; c++) {
                row.push({
                    r, c,
                    isWall: false,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previousNode: null
                });
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
        setIsRunning(false);
    };

    const handleNodeClick = (r, c) => {
        if (isRunning) return;
        const newGrid = [...grid];
        
        if (mode === 'wall') {
            if ((r !== startNode.r || c !== startNode.c) && (r !== endNode.r || c !== endNode.c)) {
                newGrid[r][c].isWall = !newGrid[r][c].isWall;
            }
        } else if (mode === 'start') {
            setStartNode({ r, c });
            newGrid[r][c].isWall = false; // Clear wall if placed on one
        } else if (mode === 'end') {
            setEndNode({ r, c });
            newGrid[r][c].isWall = false;
        }
        setGrid(newGrid);
    };

    const visualizeBFS = async () => {
        if (isRunning) return;
        setIsRunning(true);
        
        // Reset visited/path state but keep walls
        const newGrid = grid.map(row => row.map(node => ({
            ...node,
            isVisited: false,
            isPath: false,
            distance: Infinity,
            previousNode: null
        })));
        setGrid(newGrid);

        const queue = [newGrid[startNode.r][startNode.c]];
        newGrid[startNode.r][startNode.c].isVisited = true;
        newGrid[startNode.r][startNode.c].distance = 0;

        while (queue.length > 0) {
            const currentNode = queue.shift();

            // Reached end?
            if (currentNode.r === endNode.r && currentNode.c === endNode.c) {
                animatePath(currentNode);
                return;
            }

            // Neighbors
            const neighbors = getNeighbors(currentNode, newGrid);
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited && !neighbor.isWall) {
                    neighbor.isVisited = true;
                    neighbor.previousNode = currentNode;
                    neighbor.distance = currentNode.distance + 1;
                    queue.push(neighbor);
                    
                    // Visualize visit
                    setGrid([...newGrid]);
                    await new Promise(resolve => setTimeout(resolve, 20)); // Delay for animation
                }
            }
        }
        setIsRunning(false);
        alert("No path found!");
    };

    const getNeighbors = (node, grid) => {
        const neighbors = [];
        const { r, c } = node;
        if (r > 0) neighbors.push(grid[r - 1][c]);
        if (r < ROWS - 1) neighbors.push(grid[r + 1][c]);
        if (c > 0) neighbors.push(grid[r][c - 1]);
        if (c < COLS - 1) neighbors.push(grid[r][c + 1]);
        return neighbors;
    };

    const animatePath = async (endNode) => {
        let currentNode = endNode;
        const newGrid = [...grid];
        while (currentNode !== null) {
            currentNode.isPath = true;
            currentNode = currentNode.previousNode;
            setGrid([...newGrid]);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        setIsRunning(false);
    };

    return (
        <div className="pathfinding-page animate-fade-in">
            <BackButton />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="section-title" style={{ color: 'var(--primary)' }}>Pathfinding Visualizer</h2>
                
                <div className="glass-card game-card" style={{ maxWidth: '800px' }}>
                    <div className="controls" style={{ marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button 
                            className={`btn-small ${mode === 'wall' ? 'active' : ''}`} 
                            onClick={() => setMode('wall')}
                        >
                            Draw Walls
                        </button>
                        <button 
                            className={`btn-small ${mode === 'start' ? 'active' : ''}`} 
                            onClick={() => setMode('start')}
                        >
                            Set Start
                        </button>
                        <button 
                            className={`btn-small ${mode === 'end' ? 'active' : ''}`} 
                            onClick={() => setMode('end')}
                        >
                            Set End
                        </button>
                        <button className="btn-small" onClick={visualizeBFS} disabled={isRunning}>
                            Start BFS
                        </button>
                        <button className="btn-small" onClick={resetGrid} disabled={isRunning}>
                            Reset
                        </button>
                    </div>

                    <div className="grid-board">
                        {grid.map((row, rIndex) => (
                            <div key={rIndex} className="grid-row">
                                {row.map((node, cIndex) => {
                                    let className = 'grid-node';
                                    if (rIndex === startNode.r && cIndex === startNode.c) className += ' node-start';
                                    else if (rIndex === endNode.r && cIndex === endNode.c) className += ' node-end';
                                    else if (node.isWall) className += ' node-wall';
                                    else if (node.isPath) className += ' node-path';
                                    else if (node.isVisited) className += ' node-visited';

                                    return (
                                        <div 
                                            key={`${rIndex}-${cIndex}`} 
                                            className={className}
                                            onClick={() => handleNodeClick(rIndex, cIndex)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathfindingGame;
