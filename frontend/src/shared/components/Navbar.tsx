import { ArrowUpRight } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';

  return (
    <header className={`navbar${isLandingPage ? ' navbar--landing' : ''}`}>
      <Link to="/" className="navbar__brand" aria-label="Squad Pulse home">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>SQUAD PULSE</span>
      </Link>

      <nav className="navbar__links" aria-label="Primary navigation">
        {isLandingPage ? (
          <>
            <a className="navbar__link" href="#platform">Platform</a>
            <a className="navbar__link" href="#approach">Approach</a>
          </>
        ) : (
          <NavLink
            to="/team"
            className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
          >
            Workspace
          </NavLink>
        )}
        <Link className="navbar__cta" to="/team">
          <span>{isLandingPage ? 'Explore demo' : 'Team workspace'}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
