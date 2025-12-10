import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MeditationSession = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timer, setTimer] = useState(0);
    const audioRef = useRef(null);
    const timerRef = useRef(null);

    // Public domain relaxing music (Kevin MacLeod)
    const audioSrc = "https://cdn.pixabay.com/download/audio/2022/02/07/audio_1829030f22.mp3?filename=relaxing-mountains-141269.mp3";

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            clearInterval(timerRef.current);
        } else {
            audioRef.current.play();
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        setIsPlaying(!isPlaying);
    };

    const stopSession = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        clearInterval(timerRef.current);
        setTimer(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="meditation-container">
            <div className="meditation-card glass-card">
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                
                <div className="meditation-header">
                    <div className="meditation-icon">🧘‍♀️</div>
                    <h2>Meditation Session</h2>
                    <p>Close your eyes, breathe, and relax.</p>
                </div>

                <div className="timer-display">
                    {formatTime(timer)}
                </div>

                <div className="audio-visualizer">
                    {/* Simple visual animation */}
                    <div className={`circle-ripple ${isPlaying ? 'animating' : ''}`}></div>
                    <div className={`circle-ripple delay-1 ${isPlaying ? 'animating' : ''}`}></div>
                    <div className={`circle-ripple delay-2 ${isPlaying ? 'animating' : ''}`}></div>
                </div>

                <div className="controls">
                    <button onClick={togglePlay} className="control-btn play-btn">
                        {isPlaying ? '⏸ Pause' : '▶ Play Music'}
                    </button>
                    <button onClick={stopSession} className="control-btn stop-btn">
                        ⏹ Stop
                    </button>
                </div>

                <audio ref={audioRef} src={audioSrc} loop />
            </div>
        </div>
    );
};

export default MeditationSession;
