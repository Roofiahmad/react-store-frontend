const UserProfileCard = ({ profile }) => {
  return (
    <div>
      <div className="relative inline-block mx-auto">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          alt="Account Identity Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-50/50 shadow-sm"
        />
        <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-xs"></span>
      </div>
      <div>
        <h2 className="text-lg font-black text-gray-900">{profile?.name}</h2>
        <p className="text-xs text-gray-500 font-medium italic mt-1 px-4 leading-relaxed line-clamp-3">
          "{profile?.bio || "No profile bio written yet."}"
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
  );
};

export default UserProfileCard;
