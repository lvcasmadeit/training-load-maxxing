/* eslint-disable react/prop-types */
import { useState } from 'react';
import { BrainCircuit, Eye, EyeOff, Key, RefreshCw, Sparkles } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function AICoachPanel({ insights, loading, error, onRefresh, apiKey, onApiKeyChange }) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showMaskedKey, setShowMaskedKey] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    onApiKeyChange(tempKey);
    setShowKeyInput(false);
  };

  const loadingQuotes = [
    "Analyzing cardiac autonomic biometrics...",
    "Computing Acute:Chronic workload ratios...",
    "Drafting periodized vascular recovery plans...",
    "Calibrating peripheral muscular thresholds...",
    "Consulting athletic coaching algorithms..."
  ];

  const [loadingQuoteIdx] = useState(() => Math.floor(Math.random() * loadingQuotes.length));

  return (
    <section className="panel insights-panel">
      {loading && (
        <div className="insights-panel__loading">
          <div className="insights-panel__loading-content">
            <div className="loading-spinner" />
            <h3>Insights are updating...</h3>
            <p>{loadingQuotes[loadingQuoteIdx]}</p>
          </div>
        </div>
      )}

      <div className="insights-panel__header">
        <div className="insights-panel__title">
          <BrainCircuit size={22} aria-hidden="true" />
          <div>
            <h2>Insights</h2>
            <p className="insights-panel__subtitle">Load and readiness recommendations</p>
          </div>
        </div>

        <div className="insights-panel__actions">
          {apiKey ? (
            <span className="badge badge-success">
              <Sparkles size={10} /> Gemini Connected
            </span>
          ) : (
            <span className="badge badge-info">
              Background AI Active
            </span>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            <Key size={13} /> {showKeyInput ? 'Close' : 'Configure'}
          </button>
        </div>
      </div>

      {showKeyInput && (
        <form onSubmit={handleSaveKey} className="settings-form">
          <label className="settings-form__label">
            Gemini API key
            <span className="settings-form__hint">
              Stored locally and used only for this insights panel.
            </span>
          </label>

          <div className="settings-form__row">
            <input
              type={showMaskedKey ? 'text' : 'password'}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste Gemini key"
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowMaskedKey(!showMaskedKey)}
              className="icon-button"
              aria-label={showMaskedKey ? 'Hide API key' : 'Show API key'}
            >
              {showMaskedKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      )}

      {error && <p className="insights-panel__error" role="status">{error}</p>}

      {insights && insights.markdown ? (
        <>
          <MarkdownRenderer markdown={insights.markdown} />

          <button
            className="btn btn-secondary refresh-button"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={13} /> Refresh insights
          </button>
        </>
      ) : !loading && !error ? (
        <p className="insights-panel__empty">Select an athlete to see readiness and workload context.</p>
      ) : null}
    </section>
  );
}
