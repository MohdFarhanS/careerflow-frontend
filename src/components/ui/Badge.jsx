const statusStyles = {
    Applied: 'bg-slate-100 text-slate-700',
    Screening: 'bg-amber-100 text-amber-700',
    'Technical Test': 'bg-blue-100 text-blue-700',
    Interview: 'bg-primary-100 text-primary-700',
    Offered: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700',
  };
  
  export default function Badge({ status }) {
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || 'bg-ink-100 text-ink-700'}`}>
        {status}
      </span>
    );
  }