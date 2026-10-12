import { Activity, ArrowRight, ArrowUpRight, BrainCircuit, HeartPulse, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type Capability = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};


const capabilities: Capability[] = [
  {
    number: '01',
    icon: Activity,
    title: 'Read the team at a glance',
    description: 'Bring individual readiness signals into one focused view, so coaches can see who may need attention before the next session.',
  },
  {
    number: '02',
    icon: HeartPulse,
    title: 'Put workload in context',
    description: 'Review acute and chronic workload alongside recovery measures instead of treating each metric as an isolated number.',
  },
  {
    number: '03',
    icon: BrainCircuit,
    title: 'Make insights actionable',
    description: 'Translate athlete history into clear, athlete-specific coaching context with a dedicated insights workspace.',
  },
];

function ReadinessRing({ score, label }: { score: number; label: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="preview-ring" role="img" aria-label={`${label}: illustrative readiness score ${score}`}>
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle className="preview-ring__track" cx="48" cy="48" r={radius} />
        <circle
          className="preview-ring__progress"
          cx="48"
          cy="48"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="preview-ring__score">{score}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__copy">
          <p className="landing-kicker">
            <span className="landing-kicker__dot" />
            Performance intelligence for the everyday edge
          </p>
          <h1 id="landing-title">
            Better decisions<br />
            <span>start with readiness.</span>
          </h1>
          <p className="landing-hero__lede">
            One clear view of training load, recovery, and athlete context—designed to help performance teams make the next call with confidence.
          </p>
          <div className="landing-hero__actions">
            <Link className="button button--primary" to="/team">
              Explore the demo <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a className="landing-hero__text-link" href="#platform">
              See the platform <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="landing-hero__note">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Built around the daily decisions behind athlete performance.</span>
          </div>
        </div>

        <div className="landing-visual" aria-label="Illustrative Squad Pulse dashboard preview">
          <div className="landing-visual__glow" />
          <div className="landing-visual__grid" />
          <div className="preview-card">
            <div className="preview-card__topline">
              <div className="preview-brand">
                <span className="preview-brand__mark"><i /><i /><i /></span>
                <span>SQUAD PULSE <small>/ TEAM VIEW</small></span>
              </div>
              <span className="preview-live"><span /> SAMPLE DATA</span>
            </div>

            <div className="preview-card__heading">
              <div>
                <p className="preview-label">READINESS SNAPSHOT</p>
                <h2>Team overview</h2>
              </div>
              <span className="preview-period">TODAY <ArrowUpRight size={13} aria-hidden="true" /></span>
            </div>

            <div className="preview-summary">
              <div className="preview-summary__ring">
                <ReadinessRing score={82} label="Team" />
                <div>
                  <strong>82</strong>
                  <span>TEAM READINESS</span>
                </div>
              </div>
              <div className="preview-summary__divider" />
              <div className="preview-summary__stats">
                <div><span>WORKLOAD</span><strong>In range</strong></div>
                <div><span>RECOVERY</span><strong>View signals <ArrowUpRight size={13} /></strong></div>
              </div>
            </div>

            <div className="preview-roster">
              <div className="preview-roster__heading"><span>ATHLETE READINESS</span><span>ILLUSTRATIVE</span></div>
              {[
                ['AM', 'Athlete 01', '88'],
                ['JT', 'Athlete 02', '76'],
                ['KR', 'Athlete 03', '64'],
              ].map(([initials, name, score]) => (
                <div className="preview-roster__row" key={name}>
                  <span className="preview-avatar">{initials}</span>
                  <span className="preview-roster__name">{name}</span>
                  <span className="preview-roster__bar"><i style={{ width: `${score}%` }} /></span>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
            <p className="preview-caption">Illustrative interface · synthetic demo data</p>
          </div>
          <div className="landing-visual__index"><span>01</span><i /> TEAM SIGNAL</div>
        </div>

        <a className="landing-scroll" href="#platform" aria-label="Scroll to platform overview">
          <span>SCROLL TO EXPLORE</span><span className="landing-scroll__line" />
        </a>
      </section>

      <section className="platform-section" id="platform" aria-labelledby="platform-title">
        <div className="section-heading">
          <p className="eyebrow">A clearer performance picture</p>
          <h2 id="platform-title">From scattered signals<br />to a shared point of view.</h2>
          <p>Squad Pulse brings the key pieces of athlete readiness together, so coaches can spend less time piecing together data and more time applying their expertise.</p>
        </div>

        <div className="capability-grid">
          {capabilities.map(({ number, icon: Icon, title, description }) => (
            <article className="capability-card" key={number}>
              <div className="capability-card__top"><span>{number}</span><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="capability-card__rule" />
            </article>
          ))}
        </div>
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-title">
        <div className="approach-section__mark" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="approach-section__copy">
          <p className="eyebrow">A better signal, not more noise</p>
          <h2 id="approach-title">Technology in service of the coach.</h2>
          <p>Squad Pulse is designed as a practical decision-support experience: useful context for the people who know their athletes best, without replacing their judgment.</p>
        </div>
        <div className="approach-section__tag"><Zap size={15} aria-hidden="true" /> COACH-LED BY DESIGN</div>
      </section>

      <section className="landing-cta" aria-labelledby="landing-cta-title">
        <div>
          <p className="eyebrow">Step into the workspace</p>
          <h2 id="landing-cta-title">See the team in a new light.</h2>
        </div>
        <Link className="button button--light" to="/team">
          Explore the demo <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="navbar__brand" aria-label="Squad Pulse home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>SQUAD PULSE</span>
        </Link>
        <p>Readiness is context. Coaching is human.</p>
        <span>Prototype · Synthetic demo data</span>
      </footer>
    </div>
  );
}
