import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 font-sans antialiased text-gray-900">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 border border-gray-200 rounded-2xl shadow-xs">
        {/* Large Aesthetic Error Graphic Badge */}
        <div className="relative">
          <h1 className="text-8xl font-black tracking-tighter text-blue-100 select-none">
            404
          </h1>
          <p className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600 tracking-wide mt-2">
            Lost in Space
          </p>
        </div>

        {/* Informational Text Context */}
        <div className="space-y-2">
          <h2 className="text-lg font-black text-gray-900">Page Not Found</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            The url destination route you are looking for might have been
            displaced, removed, had its name updated, or is temporarily
            unavailable.
          </p>
        </div>

        {/* Separator Accent */}
        <div className="w-12 h-0.5 bg-gray-200 mx-auto rounded-full"></div>

        {/* Navigation Actions Cluster Tray */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)} // Navigates exactly 1 step backward in the native history stack
            className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors"
          >
            ← Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors shadow-xs"
          >
            Store Home
          </button>
        </div>

        {/* Footnote Identity Branding */}
        <div className="pt-4 text-[10px] text-gray-400 font-medium tracking-wide">
          NEXUS MARKETPLACE • SECURE COMPLIANCE INFRASTRUCTURE
        </div>
      </div>
    </div>
  );
}
