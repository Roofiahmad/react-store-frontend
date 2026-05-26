import { useState } from "react";
import Navbar from "../components/Navbar";

const MOCK_ORDERS = [
  {
    id: "NEX-ORD-2094",
    date: "2026-05-18",
    status: "Delivered",
    total: 2864000,
  },
  {
    id: "NEX-ORD-1045",
    date: "2026-04-12",
    status: "Cancelled",
    total: 450000,
  },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userMetadata, setUserMetadata] = useState({
    name: "Roo Ahmad",
    email: "roo@example.com",
    phone: "+62 812-3456-7890",
    location: "Tulungagung, East Java, Indonesia",
  });

  const handleUpdateSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert("Account parameters synced cleanly.");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Mounted Global Navigation Element */}
      <Navbar cartCount={2} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: SECURITY METRICS PROFILE CARD (4 Columns) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Account Identity Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-50/50 shadow-sm"
              />
              <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-xs"></span>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {userMetadata.name}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Verified Customer Base
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-left text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Total Orders:</span>{" "}
                <span className="font-bold text-gray-900">2</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tier Status:</span>{" "}
                <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">
                  Platinum
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE DASHBOARD TRAY PANEL (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* PANEL SECTION A: EDITABLE FIELD ACCOUNT PARAMETERS */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  Account Details
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {isEditing ? "Cancel Edit" : "Edit Fields"}
                </button>
              </div>

              <form
                onSubmit={handleUpdateSave}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-gray-500 mb-1">
                    Full Identity String
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={userMetadata.name}
                    onChange={(e) =>
                      setUserMetadata({ ...userMetadata, name: e.target.value })
                    }
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-gray-50 disabled:bg-gray-100/50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">
                    Electronic Mail
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={userMetadata.email}
                    onChange={(e) =>
                      setUserMetadata({
                        ...userMetadata,
                        email: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-gray-50 disabled:bg-gray-100/50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">
                    Phone Number Line
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={userMetadata.phone}
                    onChange={(e) =>
                      setUserMetadata({
                        ...userMetadata,
                        phone: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-gray-50 disabled:bg-gray-100/50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">
                    Primary Distribution Region
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={userMetadata.location}
                    onChange={(e) =>
                      setUserMetadata({
                        ...userMetadata,
                        location: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-gray-50 disabled:bg-gray-100/50 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {isEditing && (
                  <div className="sm:col-span-2 pt-2 text-right">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white font-bold px-4 py-2 text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      Commit Updates
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* PANEL SECTION B: VERIFIED PURCHASE ORDER ARCHIVE HISTORY */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-3">
                Transaction History
              </h3>

              <div className="divide-y divide-gray-100">
                {MOCK_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-900">{ord.id}</p>
                      <p className="text-gray-400">
                        Purchased clearing on: {ord.date}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <span className="font-bold text-gray-900">
                        Rp {ord.total.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 font-bold rounded-md text-[10px] uppercase tracking-wide ${ord.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
