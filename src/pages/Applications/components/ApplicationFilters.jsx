import { Search, X } from 'lucide-react';
import Select from '../../../components/ui/Select';
import { APPLICATION_STATUSES } from '../../../utils/validation/applicationSchema';

export default function ApplicationFilters({ filters, onFilterChange, onReset }) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.location !== '' ||
    filters.sort !== 'newest';

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="text"
          placeholder="Cari perusahaan atau posisi..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 outline-none transition-colors hover:border-ink-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Status */}
      <div className="w-40">
        <Select
          aria-label="Filter status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">Semua Status</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {/* Lokasi */}
      <div className="w-36">
        <input
          type="text"
          placeholder="Lokasi..."
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors hover:border-ink-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Sort */}
      <div className="w-36">
        <Select
          aria-label="Urutan"
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </Select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-ink-500 hover:bg-ink-100 hover:text-ink-700 transition-colors"
        >
          <X size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
