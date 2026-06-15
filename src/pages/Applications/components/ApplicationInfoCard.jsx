import { ExternalLink, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 text-slate-400">
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1 truncate"
          >
            {value}
            <ExternalLink size={11} />
          </a>
        ) : (
          <p className="text-sm text-slate-700">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function ApplicationInfoCard({ application }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{application.position}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{application.company_name}</p>
        </div>
        <Badge status={application.status} />
      </div>

      <div>
        <InfoRow
          icon={MapPin}
          label="Lokasi"
          value={application.location}
        />
        <InfoRow
          icon={Calendar}
          label="Tanggal Melamar"
          value={application.applied_date
            ? new Date(application.applied_date).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })
            : null}
        />
        <InfoRow
          icon={DollarSign}
          label="Gaji"
          value={application.salary_range}
        />
        <InfoRow
          icon={Briefcase}
          label="Link Lowongan"
          value={application.job_url ? 'Lihat lowongan' : null}
          href={application.job_url}
        />
      </div>
    </Card>
  );
}