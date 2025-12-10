import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DailyRoutine = () => {
    const [routines, setRoutines] = useState([]);
    const [newRoutine, setNewRoutine] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5001/api/routines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutines(response.data);
        } catch (err) {
            setError('Failed to fetch routines');
        }
    };

    const addRoutine = async (e) => {
        e.preventDefault();
        if (!newRoutine.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5001/api/routines', 
                { title: newRoutine },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoutines([response.data, ...routines]);
            setNewRoutine('');
        } catch (err) {
            setError('Failed to add routine');
        }
    };

    const toggleRoutine = async (id, completed) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/routines/${id}`, 
                { completed: !completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoutines(routines.map(r => r.id === id ? { ...r, completed: !completed } : r));
        } catch (err) {
            setError('Failed to update routine');
        }
    };

    const startEditing = (routine) => {
        setEditingId(routine.id);
        setEditTitle(routine.title);
    };

    const saveEdit = async (id) => {
        if (!editTitle.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/routines/${id}`, 
                { title: editTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoutines(routines.map(r => r.id === id ? { ...r, title: editTitle } : r));
            setEditingId(null);
        } catch (err) {
            setError('Failed to update routine');
        }
    };

    const deleteRoutine = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/routines/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutines(routines.filter(r => r.id !== id));
        } catch (err) {
            setError('Failed to delete routine');
        }
    };

    return (
        <div className="routine-page">
            <div className="routine-card">
                <h2 className="routine-title">Daily Routine</h2>
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={addRoutine} className="routine-input-group">
                    <input 
                        type="text" 
                        value={newRoutine} 
                        onChange={(e) => setNewRoutine(e.target.value)} 
                        placeholder="What's on your mind today?" 
                        className="routine-input"
                    />
                    <button type="submit" className="routine-add-btn">Add Task</button>
                </form>

                <ul className="routine-list">
                    {routines.map(routine => (
                        <li key={routine.id} className={`routine-item ${routine.completed ? 'completed' : ''}`}>
                            <div className="routine-content">
                                <input 
                                    type="checkbox" 
                                    checked={!!routine.completed} 
                                    onChange={() => toggleRoutine(routine.id, routine.completed)}
                                    className="routine-checkbox"
                                />
                                {editingId === routine.id ? (
                                    <div className="edit-group">
                                        <input 
                                            type="text" 
                                            value={editTitle} 
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="edit-input"
                                        />
                                        <button onClick={() => saveEdit(routine.id)} className="save-btn">Save</button>
                                        <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                                    </div>
                                ) : (
                                    <span className="routine-text" onClick={() => toggleRoutine(routine.id, routine.completed)}>
                                        {routine.title}
                                    </span>
                                )}
                            </div>
                            <div className="routine-actions">
                                {editingId !== routine.id && (
                                    <button onClick={() => startEditing(routine)} className="edit-icon-btn" title="Edit">
                                        ✏️
                                    </button>
                                )}
                                <button onClick={() => deleteRoutine(routine.id)} className="delete-icon-btn" title="Delete">
                                    🗑️
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DailyRoutine;
