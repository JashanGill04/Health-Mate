import AuthImagePattern from "./AuthImagePattern";

export default function AuthLayout({ title, children }) {
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">

      {/* Left form section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 bg-white dark:bg-gray-900 rounded-none lg:rounded-r-3xl shadow-lg">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8832/8832678.png"
            alt="HealthMate Logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">HealthMate</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your AI health companion</p>
        </div>

        {/* Avatar */}
        <div className="mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User avatar"
            className="w-20 h-20 rounded-full border-4 border-blue-200 shadow-md"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h2>

        {/* Form fields */}
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Right Image Panel */}
      <div className="hidden lg:flex w-1/2">
  <AuthImagePattern
    title="Welcome back!"
    subtitle="Sign in to access your personalized health dashboard"
  />
</div>

    </div>
  );
}
