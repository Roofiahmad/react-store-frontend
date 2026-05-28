import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../components/LoadingSpinner";
import AddressSection from "../modules/profile/AddressSection";
import OrderHistory from "../modules/profile/OrderHistory";
import AccountDetailSection from "../modules/profile/AccountDetailSection";
import UserProfileCard from "../modules/profile/UserProfileCard";

export default function ProfilePage() {
  const controllerRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = () => {
    return async () => {
      controllerRef.current = new AbortController();
      const { signal } = controllerRef.current;
      try {
        setLoading(true);
        const response = await api.get("/profile", {
          signal,
        });

        if (response.data.success) {
          setProfile({
            ...response.data.data,
          });
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve user profile");
        }
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    fetchUserProfile()();

    return () => {
      controllerRef.current.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {isLoading && <LoadingSpinner />}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
            <UserProfileCard profile={profile} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <AccountDetailSection
              existingUserProfile={profile}
              setLoading={setLoading}
              fetchUserProfile={fetchUserProfile}
            />
            <AddressSection profile={profile} setProfile={setProfile} />
            <OrderHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
