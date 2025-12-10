import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HoleBackground from './HoleBackground';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5001/api/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <>
            <HoleBackground />
            <div className="auth-container" style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
                <div className="glass-card">
                    <h2 className="title">Create Account</h2>
                    <p className="subtitle">Join our supportive community</p>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="label">Username</label>
                            <input
                                type="text"
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Sign Up</button>
                    </form>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Already have an account? </span>
                        <Link to="/login" className="link">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
