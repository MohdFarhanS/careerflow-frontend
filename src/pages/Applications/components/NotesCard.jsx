import { useState } from 'react';
import { Save, Edit2, X } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function NotesCard({ notes, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes || '');

  const handleSave = async () => {
    await onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(notes || '');
    setEditing(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Catatan</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
          >
            <Edit2 size={12} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            placeholder="Tambahkan catatan, misalnya: nama HR, persiapan interview, dll."
            className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-3 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none
                       placeholder:text-slate-400"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              <X size={14} className="mr-1" />
              Batal
            </Button>
            <Button variant="primary" onClick={handleSave} isLoading={saving}>
              <Save size={14} className="mr-1" />
              Simpan
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {notes ? (
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {notes}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              Belum ada catatan. Klik Edit untuk menambahkan.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}