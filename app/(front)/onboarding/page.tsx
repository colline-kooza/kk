import { ProtectedRoute } from "@/components/providers/AuthProvider";

export default function OnboardingPage() {
  return (
    <ProtectedRoute requiredRoles={["SUPER_ADMIN"]}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Welcome, Super Admin!
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Complete your school setup to get started.
          </p>

          {/* Add your onboarding form here */}
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
              Setup School Profile
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg">
              Configure System Settings
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
