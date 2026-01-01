import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const counsellors = [
    {
        id: 'ai-1',
        name: "Cara (AI Counsellor)",
        specialization: "24/7 Emotional Support",
        experience: "Always Learning",
        contact: "Video Call",
        image: "🤖",
        avatarId: "30fa96d0-26c4-4e55-94a0-517025942e18",
        voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b"
    },
    {
        id: 'ai-2',
        name: "Leo (AI Counsellor)",
        specialization: "Stress & Anxiety",
        experience: "Always Learning",
        contact: "Video Call",
        image: "🤖",
        avatarId: "81b70170-2e80-4e4b-a6fb-e04ac110dc4b",
        voiceId: "499cadd6-430b-44ae-a5a3-42e367187582"
    },
    {
        id: 'ai-3',
        name: "Dani (AI Counsellor)",
        specialization: "Mindfulness Coach",
        experience: "Always Learning",
        contact: "Video Call",
        image: "🤖",
        avatarId: "ccf00c0e-7302-455b-ace2-057e0cf58127",
        voiceId: "79abfccb-e83b-4ad4-9d80-f8d3e6e3141d"
    }
];

const CounsellorList = () => {
    const navigate = useNavigate();

    return (
        <div className="counsellor-page animate-fade-in">
            <BackButton />
            <div className="container">
                <h2 className="section-title" style={{ color: 'var(--primary)', marginBottom: '3rem' }}>AI Support</h2>
                <div className="counsellor-grid">
                    {counsellors.map(counsellor => (
                        <div key={counsellor.id} className="counsellor-card animate-slide-up">
                            <div className="counsellor-avatar">{counsellor.image}</div>
                            <h3>{counsellor.name}</h3>
                            <p className="specialization">{counsellor.specialization}</p>
                            <div className="counsellor-details">
                                <p><strong>Exp:</strong> {counsellor.experience}</p>
                                <p><strong>Contact:</strong> {counsellor.contact}</p>
                            </div>
                            <div className="counsellor-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button 
                                    className="btn-small" 
                                    style={{ background: 'var(--primary)', color: 'white', width: '100%' }}
                                    onClick={() => navigate(`/talk-to-ai/${counsellor.avatarId}?name=${encodeURIComponent(counsellor.name)}&voiceId=${counsellor.voiceId}`)}
                                >
                                    Talk to {counsellor.name.split(' ')[0]}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CounsellorList;
