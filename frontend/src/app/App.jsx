import { Route, Routes } from 'react-router-dom';
import AthleteDetailPage from '../features/athlete/AthleteDetailPage';
import HomePage from '../features/home/HomePage';
import TeamPage from '../features/team/TeamPage';
import Navbar from '../shared/components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:id" element={<AthleteDetailPage />} />
        </Routes>
      </main>
    </>
  );
}
