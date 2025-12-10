import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lotusPose from '../assets/yoga_lotus.png';
import treePose from '../assets/yoga_tree.png';
import warriorPose from '../assets/yoga_warrior.png';

import './YogaSession.css';

const YogaSession = () => {
    const navigate = useNavigate();

    return (
        <div className="yoga-container">
            <div className="yoga-header">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    <span>←</span> Back
                </button>
            </div>

            <h1 className="page-title">
                Interactive Yoga Session
            </h1>

            <div className="model-section">
                <div className="embed-wrapper">
                    <iframe
                        title="Yoga Animation"
                        className="iframe-style"
                        frameBorder="0"
                        allowFullScreen
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        src="https://sketchfab.com/models/a6196a6fa1cf413a8ebb156f37089025/embed?autostart=1&preload=1&transparent=1&ui_theme=light&dnt=1"
                    >
                    </iframe>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <h3 className="card-title">Focus</h3>
                    <p className="card-text">Concentrate on your breathing and movement alignment.</p>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Balance</h3>
                    <p className="card-text">Maintain steady posture and engage your core muscles.</p>
                </div>
                <div className="info-card">
                    <h3 className="card-title">Flow</h3>
                    <p className="card-text">Move smoothly between poses with controlled transitions.</p>
                </div>
            </div>

            <div className="leaf-decoration top-right">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <path d="M100 0C100 0 120 50 180 60C180 60 130 80 100 150C100 150 70 80 20 60C20 60 80 50 100 0Z"
                        fill="#86efac" fillOpacity="0.2" />
                </svg>
            </div>

            <div className="leaf-decoration bottom-left">
                <svg width="150" height="150" viewBox="0 0 200 200" fill="none">
                    <path d="M100 200C100 200 80 150 20 140C20 140 70 120 100 50C100 50 130 120 180 140C180 140 120 150 100 200Z"
                        fill="#86efac" fillOpacity="0.2" />
                </svg>
            </div>
        </div>
    );
};
export default YogaSession;
