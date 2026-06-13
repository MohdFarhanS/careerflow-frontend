export default function SkeletonRow({ cols = 5 }) {
    return (
      <tr className="animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
          <td key={i} className="px-4 py-3">
            <div className="h-4 rounded bg-ink-100" style={{ width: `${60 + (i % 3) * 20}%` }} />
          </td>
        ))}
      </tr>
    );
  }