import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const doctors = [
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

const DoctorList = () => {
    const navigate = useNavigate();

    return (
        <div className="counsellor-page animate-fade-in">
            <BackButton />
            <div className="container">
                <h2 className="section-title" style={{ color: 'var(--primary)', marginBottom: '3rem' }}>Book a Professional</h2>
                <div className="counsellor-grid">
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="counsellor-card animate-slide-up">
                            <div className="counsellor-avatar">{doctor.image}</div>
                            <h3>{doctor.name}</h3>
                            <p className="specialization">{doctor.specialization}</p>
                            <div className="counsellor-details">
                                <p><strong>Exp:</strong> {doctor.experience}</p>
                                <p><strong>Contact:</strong> {doctor.contact}</p>
                            </div>
                            <div className="counsellor-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button 
                                    className="btn-small" 
                                    style={{ width: '100%' }}
                                    onClick={() => navigate(`/book-appointment/${doctor.id}?name=${encodeURIComponent(doctor.name)}`)}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorList;
