import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthTabsProps {
  onAuthSuccess: (user: User) => void;
  apiBaseUrl: string;
}

export default function AuthTabs({ onAuthSuccess, apiBaseUrl }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Welcome to Auth App
        </h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => handleTabChange("signin")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "signin"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "signin" ? (
          <SignIn onSignInSuccess={onAuthSuccess} apiBaseUrl={apiBaseUrl} />
        ) : (
          <SignUp onSignUpSuccess={onAuthSuccess} apiBaseUrl={apiBaseUrl} />
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {activeTab === "signin"
            ? "Don't have an account? Click Sign Up above"
            : "Already have an account? Click Sign In above"}
          <div className="mt-2 text-xs text-gray-400">API: {apiBaseUrl}</div>
        </div>
      </div>
    </div>
  );
}
