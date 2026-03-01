export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const colors = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    info: 'bg-secondary text-white',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${colors[type]} px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
