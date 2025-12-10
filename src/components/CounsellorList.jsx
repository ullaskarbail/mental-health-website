import React from 'react';
import BackButton from './BackButton';

const counsellors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Anxiety & Depression",
        experience: "10+ years",
        contact: "sarah.j@example.com",
        image: "👩‍⚕️"
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialization: "Stress Management",
        experience: "8 years",
        contact: "michael.c@example.com",
        image: "👨‍⚕️"
    },
    {
        id: 3,
        name: "Ms. Emily Davis",
        specialization: "Mindfulness & Meditation",
        experience: "5 years",
        contact: "emily.d@example.com",
        image: "👩‍💼"
    },
    {
        id: 4,
        name: "Dr. Robert Wilson",
        specialization: "Trauma & PTSD",
        experience: "15+ years",
        contact: "robert.w@example.com",
        image: "👨‍💼"
    }
];

const CounsellorList = () => {
    return (
        <div className="counsellor-page animate-fade-in">
            <BackButton />
            <div className="container">
                <h2 className="section-title" style={{ color: 'var(--primary)', marginBottom: '3rem' }}>Professional Support</h2>
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
                                <button className="btn-small">Book Appointment</button>
                                <button className="btn-small" style={{ background: '#8b5cf6', borderColor: '#8b5cf6', color: 'white' }}>
                                    📹 Video Call
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
