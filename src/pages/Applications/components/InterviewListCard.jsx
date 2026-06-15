import { Calendar, Clock, Video, MapPin, Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

function InterviewItem({ interview }) {
  const date = new Date(`${interview.interview_date}T${interview.interview_time}`);
  const isPast = date < new Date();

  return (
    <div className={`p-3 rounded-lg border ${isPast ? 'border-slate-100 bg-slate-50' : 'border-indigo-100 bg-indigo-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          interview.interview_type === 'Online'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {interview.interview_type === 'Online' ? (
            <span className="flex items-center gap-1"><Video size={10} /> Online</span>
          ) : (
            <span className="flex items-center gap-1"><MapPin size={10} /> Offline</span>
          )}
        </span>
        {isPast && (
          <span className="text-xs text-slate-400">Selesai</span>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1">
          <Calendar size={13} className="text-slate-400" />
          {new Date(interview.interview_date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} className="text-slate-400" />
          {interview.interview_time?.slice(0, 5)}
        </span>
      </div>

      {interview.meeting_url && (
        <a
          href={interview.meeting_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:underline mt-1 block truncate"
        >
          {interview.meeting_url}
        </a>
      )}

      {interview.notes && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{interview.notes}</p>
      )}
    </div>
  );
}

export default function InterviewListCard({ interviews = [], onAddInterview }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">
          Interview
          {interviews.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({interviews.length})
            </span>
          )}
        </h3>
        <Button variant="ghost" onClick={onAddInterview}>
          <Plus size={13} className="mr-1" />
          Tambah
        </Button>
      </div>

      {interviews.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-4">
          Belum ada jadwal interview.
        </p>
      ) : (
        <div className="space-y-2">
          {interviews
            .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date))
            .map((interview) => (
              <InterviewItem key={interview.id} interview={interview} />
            ))}
        </div>
      )}
    </Card>
  );
}