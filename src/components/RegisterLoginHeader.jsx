const RegisterLoginHeader = ({ sloganText }) => {
  const appName = import.meta.env.VITE_APP_TITLE;

  return (
    <div className="sm:mx-auto w-full max-w-md text-center">
      <div className="flex justify-center items-center gap-2 mb-2">
        <span className="text-3xl font-black tracking-tight text-blue-600">
          {appName}
        </span>
        <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
          Inc
        </span>
      </div>
      <p className="text-sm text-gray-500">{sloganText}</p>
    </div>
  );
};

export default RegisterLoginHeader;
