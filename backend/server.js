const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = 5001;
const SECRET_KEY = 'your_super_secret_key_change_this_in_production';

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.resolve(__dirname, 'mental_health.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table: ' + err.message);
        } else {
            console.log('Users table ready.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error('Error creating routines table: ' + err.message);
        else console.log('Routines table ready.');
    });

    db.run(`CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        score INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error('Error creating quiz_results table: ' + err.message);
        else console.log('Quiz results table ready.');
    });
}

// Register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
        db.run(sql, [username, email, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or email already exists' });
                }
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Users CRUD
app.get('/api/users', authenticateToken, (req, res) => {
    const sql = `SELECT id, username, email, created_at FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ users: rows });
    });
});

// Update user
app.put('/api/users/:id', authenticateToken, (req, res) => {
    const { username, email } = req.body;
    const { id } = req.params;
    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ error: 'You can only update your own account' });
    }
    const sql = `UPDATE users SET username = COALESCE(?, username), email = COALESCE(?, email) WHERE id = ?`;
    db.run(sql, [username, email, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated successfully' });
    });
});

// Delete User
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    if (parseInt(id) !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own account' });
    }
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    });
});

// --- Daily Routine Endpoints ---

// Get all routines for the logged-in user
app.get('/api/routines', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM routines WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a new routine
app.post('/api/routines', authenticateToken, (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const sql = `INSERT INTO routines (user_id, title) VALUES (?, ?)`;
    db.run(sql, [req.user.id, title], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, completed: 0 });
    });
});

// Update routine (toggle completion or edit title)
app.put('/api/routines/:id', authenticateToken, (req, res) => {
    const { title, completed } = req.body;
    const { id } = req.params;

    const sql = `UPDATE routines SET title = COALESCE(?, title), completed = COALESCE(?, completed) WHERE id = ? AND user_id = ?`;
    db.run(sql, [title, completed, id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Routine not found' });
        res.json({ message: 'Routine updated' });
    });
});

// Delete routine
app.delete('/api/routines/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM routines WHERE id = ? AND user_id = ?`;
    db.run(sql, [id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Routine not found' });
        res.json({ message: 'Routine deleted' });
    });
});

// --- Quiz Results Endpoints ---

// Save quiz result
app.post('/api/quiz', authenticateToken, (req, res) => {
    const { score } = req.body;
    if (score === undefined) return res.status(400).json({ error: 'Score is required' });

    const sql = `INSERT INTO quiz_results (user_id, score) VALUES (?, ?)`;
    db.run(sql, [req.user.id, score], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Score saved', id: this.lastID });
    });
});

// Get quiz history
app.get('/api/quiz', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM quiz_results WHERE user_id = ? ORDER BY date ASC`;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/* ===========================================================
        CHATBOT   (ONLY THIS PART IS UPDATED!)
=========================================================== */

const { GoogleGenAI } = require("@google/genai");

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: `
You are a compassionate and emotionally supportive AI.
Respond calmly and helpfully.
Never judge.
If a user expresses serious mental distress,
encourage professional help and contacting someone they trust.
` }]
                },
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ],
        });

        return res.json({ reply: response.text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: "AI service unavailable" });
    }
});

/* ===========================================================
                 3D CONVERSION (unchanged)
=========================================================== */

const multer = require('multer');
const { exec } = require('child_process');
const upload = multer({ dest: "uploads/" });

app.post("/api/convert", upload.single("model"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const input = req.file.path;
    const output = path.join(__dirname, "uploads", `${req.file.filename}_optimized.glb`);
    const pythonCommand = path.join(__dirname, 'venv', 'bin', 'python3');
    const scriptPath = path.join(__dirname, 'convert.py');

    exec(`${pythonCommand} ${scriptPath} ${input} ${output}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send(err.toString());
        }
        res.download(output, 'optimized.glb');
    });
});

// Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
