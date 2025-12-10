import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const questions = [
    "I found it hard to wind down",
    "I was aware of dryness of my mouth",
    "I couldn't seem to experience any positive feeling at all",
    "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
    "I found it difficult to work up the initiative to do things",
    "I tended to over-react to situations",
    "I experienced trembling (e.g. in the hands)",
    "I felt that I was using a lot of nervous energy",
    "I was worried about situations in which I might panic and make a fool of myself",
    "I felt that I had nothing to look forward to"
];

const options = [
    { value: 0, label: "Never" },
    { value: 1, label: "Sometimes" },
    { value: 2, label: "Often" },
    { value: 3, label: "Almost always" }
];

const StressQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
    const [score, setScore] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get('http://localhost:5001/api/quiz', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch history');
        }
    };

    const handleAnswer = (value) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = value;
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = async (finalAnswers) => {
        const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
        setScore(totalScore);
        setIsFinished(true);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/quiz', 
                { score: totalScore },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchHistory();
        } catch (err) {
            console.error('Failed to save score');
        }
    };

    const resetQuiz = () => {
        setScore(null);
        setAnswers(new Array(questions.length).fill(null));
        setCurrentQuestion(0);
        setIsFinished(false);
    };

    const chartData = {
        labels: history.map(h => new Date(h.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Stress Level',
                data: history.map(h => h.score),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Stress History',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 30
            }
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="quiz-page">
            <div className="quiz-card">
                {!isFinished ? (
                    <>
                        <div className="quiz-header">
                            <h2>Stress Assessment</h2>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="question-count">Question {currentQuestion + 1} of {questions.length}</p>
                        </div>
                        
                        <div className="question-container">
                            <h3 className="question-text">{questions[currentQuestion]}</h3>
                            <div className="options-grid">
                                {options.map((opt) => (
                                    <button 
                                        key={opt.value} 
                                        onClick={() => handleAnswer(opt.value)}
                                        className="option-btn"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result-container">
                        <h2>Assessment Complete</h2>
                        <div className="score-circle">
                            <span className="score-number">{score}</span>
                            <span className="score-label">/ 30</span>
                        </div>
                        <p className="score-message">
                            {score < 10 ? "Low Stress - You're doing great!" : 
                             score < 20 ? "Moderate Stress - Consider some relaxation techniques." : 
                             "High Stress - It might be helpful to talk to someone."}
                        </p>
                        <button onClick={resetQuiz} className="retry-btn">Retake Assessment</button>
                    </div>
                )}
            </div>

            <div className="history-card">
                <button onClick={() => setShowHistory(!showHistory)} className="toggle-history-btn">
                    {showHistory ? "Hide History" : "View Progress Graph"}
                </button>
                {showHistory && (
                    <div className="chart-container">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StressQuiz;
