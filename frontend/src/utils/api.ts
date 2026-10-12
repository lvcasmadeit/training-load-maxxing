import type {
  AIInsightsResponse,
  AthleteHistoryEntry,
  AthleteSummary,
  ResetResponse,
} from '../types/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

/**
 * Fetches all athletes summaries (current ACWR, readiness, resting HR, etc.)
 */
export async function fetchAthletes(): Promise<AthleteSummary[]> {
  const response = await fetch(`${API_BASE_URL}/athletes`);
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
}

/**
 * Fetches the 45-day history logs for a specific athlete
 */
export async function fetchAthleteHistory(athleteId: string): Promise<AthleteHistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}/history`);
  if (!response.ok) {
    throw new Error(`Failed to fetch history for athlete ${athleteId}`);
  }
  return response.json();
}

/**
 * Fetches LLM-powered or local-heuristic coaching insights for a specific athlete.
 * Optionally passes a Gemini API Key via request headers.
 */
export async function fetchAthleteInsights(
  athleteId: string,
  geminiApiKey?: string,
): Promise<AIInsightsResponse> {
  const headers: Record<string, string> = {};
  if (geminiApiKey && geminiApiKey.trim()) {
    headers['X-Gemini-Key'] = geminiApiKey.trim();
  }

  const response = await fetch(`${API_BASE_URL}/athletes/${athleteId}/insights`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI insights for athlete ${athleteId}`);
  }
  return response.json();
}

/**
 * Resets the in-memory database on the Python backend to initial baselines.
 */
export async function resetDatabase(): Promise<ResetResponse> {
  const response = await fetch(`${API_BASE_URL}/athletes/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset backend database');
  }
  return response.json();
}
