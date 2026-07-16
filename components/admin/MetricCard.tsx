'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}

const colorClasses = {
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'orange',
}: MetricCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-2 text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm opacity-75">
                {Math.abs(trend)}% {trendLabel || 'vs last month'}
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-3xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
}
