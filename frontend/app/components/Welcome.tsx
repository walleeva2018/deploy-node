import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
}

interface WelcomeProps {
  user: User;
  onLogout: () => void;
  apiBaseUrl: string;
}

export default function Welcome({ user, onLogout, apiBaseUrl }: WelcomeProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
  };

  const handleGoToTasks = () => {
    router.push("/tasks");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Welcome, {user.username}! 👋
        </h1>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Username:</span>{" "}
              {user.username}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              {user.email}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold text-gray-800">User ID:</span>{" "}
              {user.id}
            </p>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Connected to: {apiBaseUrl}
          </div>
        </div>

        <div className="space-y-3">
          {/* Main Task Management Button */}
          <button
            onClick={handleGoToTasks}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            📝 Manage Tasks
          </button>


          {/* Logout Button */}
          <div className="border-t pt-3">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Quick Actions:
          </h3>
          <p className="text-xs text-blue-600">
            Click Manage Tasks to create, edit, and organize your tasks, or use
            the API buttons to test the backend directly.
          </p>
        </div>
      </div>
    </div>
  );
}
