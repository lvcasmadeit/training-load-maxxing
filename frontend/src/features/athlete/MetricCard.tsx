import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  colorClass?: string;
  subtitle?: string;
  progressValue?: number;
};

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  colorClass,
  subtitle,
  progressValue,
}: MetricCardProps) {
  const progress = `${Math.min(100, Math.max(0, progressValue ?? 0))}%`;

  return (
    <article className="panel metric-card" data-status={colorClass || 'neutral'}>
      <div className="metric-card__header">
        <span className="metric-card__title">{title}</span>
        <div className="metric-card__icon" aria-hidden="true">
          {Icon && <Icon size={18} />}
        </div>
      </div>

      <div>
        <div className="metric-card__value-row">
          <span className="metric-card__value">{value}</span>
          {unit && <span className="metric-card__unit">{unit}</span>}
        </div>
        {subtitle && <p className="metric-card__subtitle">{subtitle}</p>}
      </div>

      {progressValue !== undefined && (
        <div>
          <div className="metric-card__progress">
            <div className="metric-card__progress-fill" style={{ '--progress': progress } as CSSProperties & { '--progress': string }} />
          </div>
          <div className="metric-card__scale">
            <span>0</span>
            <span>Target / Peak</span>
          </div>
        </div>
      )}
    </article>
  );
}
