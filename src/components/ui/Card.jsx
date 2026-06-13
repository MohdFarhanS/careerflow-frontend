export default function Card({ children, className = '' }) {
    return (
      <div className={`bg-white rounded-2xl shadow-card border border-ink-100 p-5 ${className}`}>
        {children}
      </div>
    );
  }