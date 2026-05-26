export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 min-h-screen w-screen flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-50 font-sans">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        Loading Resource...
      </p>
    </div>
  );
}
