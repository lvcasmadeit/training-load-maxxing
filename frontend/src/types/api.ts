export interface WorkoutRecord {
  id: string;
  type: string;
  duration_min: number;
  avg_hr: number;
  max_hr: number;
  rpe: number;
}

export interface AthleteHistoryEntry {
  date: string;
  weekday?: number;
  resting_hr: number;
  hrv: number;
  sleep_duration: number;
  sleep_quality: number;
  steps: number;
  active_calories: number;
  workouts: WorkoutRecord[];
  daily_load: number;
  acute_workload: number;
  chronic_workload: number;
  acwr: number;
  acwr_zone: string;
  hrv_score: number;
  readiness_score: number;
}

export interface AthleteCurrentStatus {
  date: string;
  resting_hr: number;
  hrv: number;
  sleep_duration: number;
  sleep_quality: number;
  steps: number;
  active_calories: number;
  daily_load: number;
  acute_workload: number;
  chronic_workload: number;
  acwr: number;
  acwr_zone: string;
  readiness_score: number;
}

export interface AthleteAverages {
  total_workouts: number;
  avg_hrv: number;
  avg_sleep_quality: number;
  avg_acwr: number;
}

export interface AthleteSummary {
  id: string;
  name: string;
  sport: string;
  age: number;
  weight_kg: number;
  bio: string;
  current_status: AthleteCurrentStatus;
  averages: AthleteAverages;
}

export interface AIInsightsResponse {
  markdown: string;
}

export interface ResetResponse {
  status: string;
  message: string;
}
