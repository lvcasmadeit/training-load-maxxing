import { Activity, Heart, Moon, ShieldAlert } from 'lucide-react';
import MetricCard from './MetricCard';
import PerformanceChart from './PerformanceChart';
import type { AthleteHistoryEntry, AthleteSummary } from '../../types/api';

type AthleteDetailPageProps = {
  athlete: AthleteSummary | undefined;
  history: AthleteHistoryEntry[];
};


export default function AthleteDetailPage({ athlete, history }: AthleteDetailPageProps) {
  if (!athlete) return null;

  const { current_status: currentStatus, averages } = athlete;

  return (
    <div className="detail-main">
      <article className="panel profile-card">
        <div className="avatar" aria-hidden="true">{athlete.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
        <div className="profile-card__body">
          <div className="profile-card__title-row">
            <div>
              <p className="eyebrow">ATHLETE PROFILE</p>
              <h1>{athlete.name}</h1>
            </div>
            <span className="badge badge-info">{athlete.sport}</span>
          </div>
          <p className="profile-card__meta">Age {athlete.age} <span /> {athlete.weight_kg} kg</p>
          <p className="profile-card__bio">{athlete.bio}</p>
        </div>
      </article>

      <section className="metric-grid" aria-label="Current athlete metrics">
        <MetricCard
          title="Autonomic state"
          value={currentStatus.hrv}
          unit="ms HRV"
          icon={Activity}
          colorClass={currentStatus.hrv >= averages.avg_hrv * 0.95 ? 'success' : 'danger'}
          subtitle={`Baseline average: ${averages.avg_hrv} ms`}
          progressValue={(currentStatus.hrv / 130) * 100}
        />
        <MetricCard
          title="Resting heart rate"
          value={currentStatus.resting_hr}
          unit="BPM"
          icon={Heart}
          colorClass={currentStatus.resting_hr <= 50 ? 'success' : currentStatus.resting_hr <= 65 ? 'info' : 'warning'}
          subtitle="Lower is more cardiovascularly adapted."
          progressValue={((90 - currentStatus.resting_hr) / 55) * 100}
        />
        <MetricCard
          title="Recovery sleep"
          value={`${currentStatus.sleep_duration}h`}
          unit={`${currentStatus.sleep_quality}%`}
          icon={Moon}
          colorClass={currentStatus.sleep_quality >= 80 ? 'success' : currentStatus.sleep_quality >= 60 ? 'warning' : 'danger'}
          subtitle="Supports nervous system recovery."
          progressValue={currentStatus.sleep_quality}
        />
        <MetricCard
          title="Training stress"
          value={currentStatus.acwr}
          unit={currentStatus.acwr_zone}
          icon={ShieldAlert}
          colorClass={currentStatus.acwr_zone === 'Sweet Spot' ? 'success' : currentStatus.acwr_zone === 'Danger Zone' ? 'danger' : 'warning'}
          subtitle={`Acute ${currentStatus.acute_workload} / Chronic ${currentStatus.chronic_workload}`}
          progressValue={(currentStatus.acwr / 2.0) * 100}
        />
      </section>

      <PerformanceChart history={history} />
    </div>
  );
}
