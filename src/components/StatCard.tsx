import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card-surface card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          {delta && <div className="mt-1 text-xs text-success">{delta}</div>}
        </div>
        {icon && (
          <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
