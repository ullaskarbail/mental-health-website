import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BoxBreathing from './components/BoxBreathingGame';
import YogaSession from './components/YogaSession';
import YogaModelViewer from './components/YogaModelViewer';
import DailyRoutine from './components/DailyRoutine';
import StressQuiz from './components/StressQuiz';
import MeditationSession from './components/MeditationSession';
import ZenDrawing from './components/ZenDrawing';
import PuzzleGame from './components/PuzzleGame';
import CupGame from './components/CupGame';
import NQueensGame from './components/NQueensGame';
import MemeGenerator from './components/MemeGenerator';
import CounsellorList from './components/CounsellorList';

import AICounsellorSession from './components/AICounsellorSession';
import DoctorList from './components/DoctorList';
import AppointmentBooking from './components/AppointmentBooking';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/breathing" element={<BoxBreathing />} />
                <Route path="/yoga" element={<YogaSession />} />
                <Route path="/yoga-model" element={<YogaModelViewer />} />
                <Route path="/routine" element={<DailyRoutine />} />
                <Route path="/quiz" element={<StressQuiz />} />
                <Route path="/meditation" element={<MeditationSession />} />
                <Route path="/zen-drawing" element={<ZenDrawing />} />
                <Route path="/puzzle" element={<PuzzleGame />} />
                <Route path="/cup-game" element={<CupGame />} />
                <Route path="/nqueens" element={<NQueensGame />} />
                <Route path="/meme" element={<MemeGenerator />} />
                <Route path="/counsellors" element={<CounsellorList />} />
                <Route path="/doctors" element={<DoctorList />} />
                <Route path="/talk-to-ai/:avatarId" element={<AICounsellorSession />} />
                <Route path="/book-appointment/:counsellorId" element={<AppointmentBooking />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
