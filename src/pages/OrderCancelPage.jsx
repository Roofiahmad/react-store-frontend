import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PATHS } from "../constants";

export default function OrderCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-16">
      <Navbar />

      <main className="mx-auto max-w-md px-4 pt-16 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xs text-center space-y-5 animate-fade-in">          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs mb-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-6 h-6 animate-pulse"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" 
              />
            </svg>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
              Transaction Session Deferred
            </p>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              Checkout session canceled
            </h1>
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
              No charges or modifications were executed against your account credit limit bounds. 
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left flex gap-3 items-start text-xs text-gray-600 leading-relaxed">
            <span className="text-lg pt-0.5">🛒</span>
            <div>
              <p className="font-bold text-gray-800">Your shopping cart is safe!</p>
              <p className="text-gray-500 font-light mt-0.5">
                We kept all your items perfectly staged inside your active basket session so you don't lose your selection tracks.
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs">
            <button
              type="button"
              onClick={() => navigate(PATHS.CHECKOUT)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-xs uppercase tracking-wider transition-all"
            >
              🔄 Re-initiate Checkout Session
            </button>
            
            <button
              type="button"
              onClick={() => navigate(PATHS.HOME)}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-colors uppercase tracking-wider text-center"
            >
              Continue Browsing Market
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}