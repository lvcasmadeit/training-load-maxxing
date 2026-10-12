import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import TeamPage from '../features/team/TeamPage';
import Navbar from '../shared/components/Navbar';

export default function App() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`app-shell${isLandingPage ? ' app-shell--landing' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route path="*" element={<TeamPage />} />
        </Routes>
      </main>
    </>
  );
}
