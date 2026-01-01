import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import BackButton from './BackButton';

const AppointmentBooking = () => {
    const navigate = useNavigate();
    const { counsellorId } = useParams();
    const [searchParams] = useSearchParams();
    const counsellorName = searchParams.get('name') || 'Dr. Smith';

    const [formData, setFormData] = useState({
        date: '',
        day: '',
        timeSlot: '',
        duration: '30 mins',
        reason: '',
        name: '',
        contact: ''
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    // Mock available slots based on date
    useEffect(() => {
        if (formData.date) {
            const dateObj = new Date(formData.date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[dateObj.getDay()];
            
            setFormData(prev => ({ ...prev, day: dayName }));

            // Mock slots
            setAvailableSlots([
                '09:00 AM - 09:30 AM',
                '10:00 AM - 10:30 AM',
                '02:00 PM - 02:30 PM',
                '04:00 PM - 04:30 PM'
            ]);
        }
    }, [formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        alert(`Appointment booked with ${counsellorName} on ${formData.date} at ${formData.timeSlot}`);
        navigate('/counsellors');
    };

    return (
        <div className="appointment-page animate-fade-in">
            <BackButton />
            <div className="appointment-container">
                <h2 className="section-title" style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Book Appointment</h2>
                
                <div className="doctor-info-card">
                    <h3>Booking with {counsellorName}</h3>
                    <p>Please fill in the details below to schedule your session.</p>
                </div>

                <form className="appointment-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            className="input" 
                            required 
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Day</label>
                        <input 
                            type="text" 
                            name="day" 
                            className="input" 
                            value={formData.day} 
                            readOnly 
                            placeholder="Select a date first"
                            style={{ background: '#f1f5f9' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Available Time Slots</label>
                        <select 
                            name="timeSlot" 
                            className="input" 
                            required 
                            onChange={handleChange}
                            disabled={!formData.date}
                        >
                            <option value="">Select a time slot</option>
                            {availableSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Duration</label>
                        <select 
                            name="duration" 
                            className="input" 
                            onChange={handleChange}
                            value={formData.duration}
                        >
                            <option value="30 mins">30 Minutes</option>
                            <option value="45 mins">45 Minutes</option>
                            <option value="60 mins">1 Hour</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Reason for Visit</label>
                        <textarea 
                            name="reason" 
                            className="input" 
                            rows="4" 
                            placeholder="Briefly describe your concern..."
                            required
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn">Confirm Booking</button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentBooking;
