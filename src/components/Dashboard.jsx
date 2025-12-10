import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BubblePopGame from './BubblePopGame';
import Chatbot from './Chatbot';

const quotes = [
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Your present circumstances don't determine where you can go; they merely determine where you start.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Happiness is not something ready made. It comes from your own actions."
];

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [quote, setQuote] = useState('');
    const [showGame, setShowGame] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token) {
            navigate('/login');
            return;
        }

        setCurrentUser(user);
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="container">
            <header className="dashboard-header">
                <div>
                    <h1 className="title" style={{ textAlign: 'left', fontSize: '1.5rem', color: 'var(--primary)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome, {currentUser?.username}</p>
                </div>
                <button onClick={handleLogout} className="btn-outline">
                    Logout
                </button>
            </header>

            <div className="dashboard-content animate-fade-in">
                {/* Quote of the Day */}
                <div className="quote-section-large">
                    <h3>Quote of the Day</h3>
                    <blockquote className="quote-text-large">"{quote}"</blockquote>
                </div>

                {/* Mood Tracks */}
                <section className="section-container">
                    <h3 className="section-title">Mood Tracks</h3>
                    <div className="tracks-grid">
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🧘</div>
                            <h4>Yoga</h4>
                            <p>Relax your body</p>
                            <Link to="/yoga">
                                <button className="btn-small">Start Session</button>
                            </Link>
                        </div>
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🎨</div>
                            <h4>Zen Drawing</h4>
                            <p>Express freely</p>
                            <Link to="/zen-drawing">
                                <button className="btn-small">Start Drawing</button>
                            </Link>
                        </div>
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">📝</div>
                            <h4>Daily Routine</h4>
                            <p>Plan your day</p>
                            <Link to="/routine">
                                <button className="btn-small">Manage</button>
                            </Link>
                        </div>
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">📊</div>
                            <h4>Stress Quiz</h4>
                            <p>Check anxiety</p>
                            <Link to="/quiz">
                                <button className="btn-small">Take Quiz</button>
                            </Link>
                        </div>
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🤝</div>
                            <h4>Counsellors</h4>
                            <p>Get Support</p>
                            <Link to="/counsellors">
                                <button className="btn-small">Find Help</button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Relaxing Games */}
                <section className="section-container">
                    <h3 className="section-title">Relaxing Games & Creativity</h3>
                    <div className="tracks-grid">

                        {/* Breathing Game Card with Link */}
                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🌬️</div>
                            <h4>Breathing</h4>
                            <p>Focus on breath</p>
                            <Link to="/breathing">
                                <button className="btn-small">Play</button>
                            </Link>
                        </div>

                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🫧</div>
                            <h4>Bubble Pop</h4>
                            <p>Stress relief</p>
                            <button className="btn-small" onClick={() => setShowGame(true)}>Play</button>
                        </div>

                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🧩</div>
                            <h4>Puzzle Game</h4>
                            <p>Brain teaser</p>
                            <Link to="/puzzle">
                                <button className="btn-small">Play</button>
                            </Link>
                        </div>

                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🥤</div>
                            <h4>Find the Ball</h4>
                            <p>Focus Game</p>
                            <Link to="/cup-game">
                                <button className="btn-small">Play</button>
                            </Link>
                        </div>

                        <div className="track-card animate-slide-up">
                            <div className="track-icon">♛</div>
                            <h4>N-Queens</h4>
                            <p>Logic Puzzle</p>
                            <Link to="/nqueens">
                                <button className="btn-small">Play</button>
                            </Link>
                        </div>

                        <div className="track-card animate-slide-up">
                            <div className="track-icon">🖼️</div>
                            <h4>Meme Maker</h4>
                            <p>Create Fun</p>
                            <Link to="/meme">
                                <button className="btn-small">Create</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* Game Overlay */}
            {showGame && <BubblePopGame onClose={() => setShowGame(false)} />}

            {/* Chatbot */}
            <Chatbot />
        </div>
    );
};

export default Dashboard;
