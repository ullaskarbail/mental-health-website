import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HoleBackground from './HoleBackground';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5001/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <>
            <HoleBackground />
            <div className="auth-container" style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
                <div className="glass-card">
                    <h2 className="title">Welcome Back</h2>
                    <p className="subtitle">Login to your account</p>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleLogin}>
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
                        <button type="submit" className="btn">Login</button>
                    </form>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Don't have an account? </span>
                        <Link to="/register" className="link">Sign up</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
