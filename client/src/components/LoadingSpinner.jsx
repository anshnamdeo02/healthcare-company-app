export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border-3 border-gray-200 border-t-primary`} />
    </div>
  );
}
