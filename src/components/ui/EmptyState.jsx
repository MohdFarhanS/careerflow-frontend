import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Belum ada data',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
        <Icon size={28} className="text-ink-400" />
      </div>
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}