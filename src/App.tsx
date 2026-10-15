/**
 * Main App component with React Router and UserProvider setup.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './lib/context';
import HomePage from './pages/HomePage';
import BuildingInteriorPage from './pages/BuildingInteriorPage';
import InterestTestPage from './pages/InterestTestPage';
import ProfessionPage from './pages/ProfessionPage';
import ResultPage from './pages/ResultPage';
import CandidatePage from './pages/CandidatePage';
import ComparePage from './pages/ComparePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <UserProvider>
      <div className="scanlines" style={{ minHeight: '100dvh', background: 'var(--color-bg-dark)' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gedung/:id" element={<BuildingInteriorPage />} />
            <Route path="/tes-minat" element={<InterestTestPage />} />
            <Route path="/profesi/:id" element={<ProfessionPage />} />
            <Route path="/hasil" element={<ResultPage />} />
            <Route path="/kandidat" element={<CandidatePage />} />
            <Route path="/bandingkan" element={<ComparePage />} />
            <Route path="/pengaturan" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}
