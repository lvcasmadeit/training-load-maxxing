/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';

function getReadinessStatus(score) {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

export default function AthleteCard({ athlete, onSelect }) {
  const score = athlete.current_status.readiness_score;
  const status = getReadinessStatus(score);
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <NavLink
      to={`/team/${athlete.id}`}
      className={({ isActive }) => `roster-item${isActive ? ' is-active' : ''}`}
      aria-label={`${athlete.name}, ${athlete.sport}, readiness ${score}`}
      onClick={onSelect}
    >
      <span className="roster-item__avatar" aria-hidden="true">{athlete.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
      <span className="roster-item__identity">
        <strong>{athlete.name}</strong>
        <span>{athlete.sport}</span>
      </span>
      <span
        className="readiness-ring readiness-ring--roster"
        data-status={status}
        role="img"
        aria-label={`Readiness ${score} out of 100`}
      >
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle className="readiness-ring__track" cx="26" cy="26" r={radius} />
          <circle
            className="readiness-ring__progress"
            cx="26"
            cy="26"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="readiness-ring__value">{score}</span>
      </span>
    </NavLink>
  );
}
