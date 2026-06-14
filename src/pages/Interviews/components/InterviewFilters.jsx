// src/pages/Interviews/components/InterviewFilters.jsx

/**
 * Filter bar untuk halaman Interviews.
 * Sengaja simple (tidak ada search by company name di sini)
 * karena data interview sudah sedikit per user.
 * Filter: upcoming toggle, interview_type, sort order.
 */
export default function InterviewFilters({ filters, onFilterChange }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Toggle: Upcoming only */}
            <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer select-none">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
                    checked={filters.upcoming === 'true'}
                    onChange={(e) => onFilterChange('upcoming', e.target.checked ? 'true' : '')}
                />
                Hanya yang akan datang
            </label>

            {/* Filter: Tipe */}
            <select
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.interview_type}
                onChange={(e) => onFilterChange('interview_type', e.target.value)}
            >
                <option value="">Semua Tipe</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
            </select>

            {/* Sort */}
            <select
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filters.sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
            >
                <option value="soonest">Paling Dekat</option>
                <option value="latest">Paling Jauh</option>
            </select>
        </div>
    );
}