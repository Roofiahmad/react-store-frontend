import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";

const AccountDetailSection = ({
  existingUserProfile,
  setLoading,
  fetchUserProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(existingUserProfile);

  const handleUpdateSave = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    const payload = {
      bio: profile.bio,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth,
    };

    try {
      setLoading(true);
      const response = await api.put("/profile", payload);

      if (response.data.success) {
        fetchUserProfile()();
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Could not retrieve user profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(existingUserProfile);
  }, [existingUserProfile]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
          Account Details
        </h3>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          {isEditing ? "Cancel Edit" : "Edit Fields"}
        </button>
      </div>

      <form onSubmit={handleUpdateSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-500 mb-1">
              Full Identity String
            </label>
            <input
              type="text"
              disabled={true}
              value={profile?.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-gray-100/70 text-gray-400 font-medium cursor-not-allowed border-dashed focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-500 mb-1">
              Electronic Mail
            </label>
            <input
              type="email"
              disabled={true}
              value={profile?.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-gray-100/70 text-gray-400 font-medium cursor-not-allowed border-dashed focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-500 mb-1">
              Phone Number Line
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile?.phoneNumber || ""}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              className={`w-full text-sm border rounded-lg p-2.5 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
            ${isEditing ? "bg-white border-gray-300 text-gray-900 shadow-2xs" : "bg-gray-100/70 border-gray-200 text-gray-500 cursor-not-allowed"}`}
            />
          </div>

          <div>
            <label className="block font-bold text-gray-500 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              disabled={!isEditing}
              value={profile?.dateOfBirth || ""}
              onChange={(e) =>
                setProfile({ ...profile, dateOfBirth: e.target.value })
              }
              className={`w-full text-sm border rounded-lg p-2.5 transition-colors select-none focus:outline-none focus:border-blue-500
            ${isEditing ? "bg-white border-gray-300 text-gray-900 shadow-2xs" : "bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed"}`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-500 mb-1">
              Profile Biography / Summary
            </label>
            <textarea
              rows="3"
              disabled={!isEditing}
              value={profile?.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className={`w-full text-sm border rounded-lg p-2.5 transition-colors leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
            ${isEditing ? "bg-white border-gray-300 text-gray-900 shadow-2xs" : "bg-gray-100/70 border-gray-200 text-gray-500 cursor-not-allowed"}`}
              placeholder="Tell us a little bit about yourself, bro..."
            />
          </div>
        </div>

        {isEditing && (
          <div className="pt-2 text-right animate-fade-in">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold px-5 py-2.5 text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            >
              Commit Updates
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountDetailSection;
