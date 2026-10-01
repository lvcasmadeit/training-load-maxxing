import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrainCircuit, PanelLeft, PanelRight } from 'lucide-react';
import AthleteDetailPage from '../athlete/AthleteDetailPage';
import AICoachPanel from '../insights/AICoachPanel';
import AthleteCard from './AthleteCard';
import { fetchAthleteHistory, fetchAthleteInsights, fetchAthletes } from '../../utils/api';

function isCompactViewport() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 1020px)').matches;
}

function formatDate(value) {
  if (!value) return 'Today';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [rosterError, setRosterError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyFor, setHistoryFor] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [insights, setInsights] = useState(null);
  const [insightsFor, setInsightsFor] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [isCompact, setIsCompact] = useState(isCompactViewport);
  const [rosterOpen, setRosterOpen] = useState(() => !isCompactViewport());
  const [insightsOpen, setInsightsOpen] = useState(() => !isCompactViewport());
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1020px)');
    const handleViewportChange = (event) => {
      setIsCompact(event.matches);
      if (event.matches) {
        setRosterOpen(false);
        setInsightsOpen(false);
      }
    };
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRoster() {
      setRosterLoading(true);
      setRosterError('');
      try {
        const data = await fetchAthletes();
        if (isMounted) setAthletes(data);
      } catch (error) {
        console.error('Error loading athletes:', error);
        if (isMounted) setRosterError('Unable to load the team right now. Check that the API is running, then try again.');
      } finally {
        if (isMounted) setRosterLoading(false);
      }
    }

    loadRoster();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!rosterLoading && !rosterError && athletes.length > 0 && !id) {
      navigate(`/team/${athletes[0].id}`, { replace: true });
    }
  }, [athletes, id, navigate, rosterError, rosterLoading]);

  useEffect(() => {
    if (!id) {
      setHistory([]);
      setHistoryFor('');
      return undefined;
    }

    let isCurrent = true;
    setHistory([]);
    setHistoryFor('');
    setHistoryError('');
    setHistoryLoading(true);

    fetchAthleteHistory(id)
      .then((data) => {
        if (!isCurrent) return;
        setHistory(data);
        setHistoryFor(String(id));
      })
      .catch((error) => {
        console.error('Error loading athlete history:', error);
        if (isCurrent) setHistoryError('Unable to load this athlete’s training history.');
      })
      .finally(() => {
        if (isCurrent) setHistoryLoading(false);
      });

    return () => { isCurrent = false; };
  }, [id]);

  useEffect(() => {
    if (!id) {
      setInsights(null);
      return undefined;
    }

    let isCurrent = true;
    setInsights(null);
    setInsightsFor('');
    setInsightsError('');
    setInsightsLoading(true);

    fetchAthleteInsights(id, geminiApiKey)
      .then((data) => {
        if (!isCurrent) return;
        setInsights(data);
        setInsightsFor(String(id));
      })
      .catch((error) => {
        console.error('Error loading athlete insights:', error);
        if (isCurrent) setInsightsError('Insights could not be loaded. Try refreshing in a moment.');
      })
      .finally(() => {
        if (isCurrent) setInsightsLoading(false);
      });

    return () => { isCurrent = false; };
  }, [geminiApiKey, id, refreshCount]);

  const selectedAthlete = athletes.find((athlete) => String(athlete.id) === String(id));
  const showScrim = isCompact && (rosterOpen || insightsOpen);

  const handleRosterToggle = () => {
    if (isCompact && !rosterOpen) setInsightsOpen(false);
    setRosterOpen((open) => !open);
  };

  const handleInsightsToggle = () => {
    if (isCompact && !insightsOpen) setRosterOpen(false);
    setInsightsOpen((open) => !open);
  };

  const handleApiKeyChange = (newKey) => {
    setGeminiApiKey(newKey);
    try {
      localStorage.setItem('gemini_api_key', newKey);
    } catch {
      // The key still works for this session if browser storage is unavailable.
    }
  };

  const workspaceClasses = [
    'team-workspace',
    !rosterOpen && 'team-workspace--roster-hidden',
    !insightsOpen && 'team-workspace--insights-hidden',
  ].filter(Boolean).join(' ');

  return (
    <section className={workspaceClasses} aria-label="Team performance workspace">
      {showScrim && (
        <button
          className="workspace-scrim"
          type="button"
          aria-label="Close open panels"
          onClick={() => { setRosterOpen(false); setInsightsOpen(false); }}
        />
      )}

      {rosterOpen && (
        <aside className="workspace-roster panel" id="team-roster" aria-label="Team roster">
          <header className="workspace-roster__header">
            <div>
              <p className="eyebrow">THE SQUAD</p>
              <h2>Team</h2>
            </div>
            <span className="workspace-roster__count">{String(athletes.length).padStart(2, '0')}</span>
          </header>

          {rosterLoading ? (
            <div className="workspace-panel-state"><div className="loading-spinner" /><span>Loading team…</span></div>
          ) : rosterError ? (
            <p className="workspace-panel-error">{rosterError}</p>
          ) : (
            <nav className="roster-list" aria-label="Select an athlete">
              {athletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  onSelect={isCompact ? () => setRosterOpen(false) : undefined}
                />
              ))}
            </nav>
          )}

          <footer className="workspace-roster__footer">
            <span className="sample-dot" /> Synthetic demo data
          </footer>
        </aside>
      )}

      <main className="workspace-center">
        <header className="workspace-toolbar">
          <div className="workspace-toolbar__toggles">
            <button
              type="button"
              className={`workspace-toggle${rosterOpen ? ' is-open' : ''}`}
              onClick={handleRosterToggle}
              aria-controls="team-roster"
              aria-expanded={rosterOpen}
              aria-label={rosterOpen ? 'Hide team roster' : 'Show team roster'}
            >
              <PanelLeft size={17} aria-hidden="true" />
              <span>Roster</span>
            </button>
            <button
              type="button"
              className={`workspace-toggle${insightsOpen ? ' is-open' : ''}`}
              onClick={handleInsightsToggle}
              aria-controls="athlete-insights"
              aria-expanded={insightsOpen}
              aria-label={insightsOpen ? 'Hide insights panel' : 'Show insights panel'}
            >
              <PanelRight size={17} aria-hidden="true" />
              <span>Insights</span>
            </button>
          </div>
          <span className="workspace-toolbar__date">{formatDate(selectedAthlete?.current_status?.date)}</span>
        </header>

        <div className="workspace-main-scroll">
          {rosterLoading ? (
            <div className="workspace-content-state"><div className="loading-spinner" /><p>Preparing your team workspace…</p></div>
          ) : rosterError ? (
            <div className="workspace-content-state"><p className="empty-state">{rosterError}</p></div>
          ) : !selectedAthlete ? (
            <div className="workspace-content-state"><p className="empty-state">Select an athlete from the team list.</p></div>
          ) : (
            <>
              <div className="workspace-heading">
                <div>
                  <p className="eyebrow">PERFORMANCE OVERVIEW</p>
                  <h2>Daily readiness</h2>
                </div>
                <span className="workspace-heading__status"><span /> Demo environment</span>
              </div>
              {historyError ? (
                <div className="workspace-content-state"><p className="empty-state">{historyError}</p></div>
              ) : historyLoading || historyFor !== String(id) ? (
                <div className="workspace-content-state"><div className="loading-spinner" /><p>Loading athlete profile…</p></div>
              ) : (
                <AthleteDetailPage athlete={selectedAthlete} history={history} />
              )}
            </>
          )}
        </div>
      </main>

      {insightsOpen && (
        <aside className="workspace-insights" id="athlete-insights" aria-label="Athlete insights">
          {selectedAthlete ? (
            <AICoachPanel
              insights={insightsFor === String(id) ? insights : null}
              loading={insightsLoading}
              error={insightsError}
              onRefresh={() => setRefreshCount((count) => count + 1)}
              apiKey={geminiApiKey}
              onApiKeyChange={handleApiKeyChange}
            />
          ) : (
            <div className="panel insights-placeholder">
              <BrainCircuit size={22} aria-hidden="true" />
              <h2>Insights</h2>
              <p>Select an athlete to view individualized coaching context.</p>
            </div>
          )}
        </aside>
      )}
    </section>
  );
}
