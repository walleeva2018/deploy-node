import { useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface ApiUser {
  _id: string;
  username: string;
  email: string;
}

interface UsersResponse {
  users: ApiUser[];
}

interface SignInProps {
  onSignInSuccess: (user: User) => void;
  apiBaseUrl: string;
}

export default function SignIn({ onSignInSuccess, apiBaseUrl }: SignInProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // For demo purposes, we'll simulate login by checking if user exists
      // In a real app, you'd have a proper login endpoint
      const response = await fetch(`${apiBaseUrl}/users`);
      const data: UsersResponse = await response.json();

      if (response.ok) {
        const existingUser = data.users.find(
          (u: ApiUser) =>
            u.username === formData.username || u.email === formData.username
        );

        if (existingUser) {
          const userData = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          onSignInSuccess(userData);
          setFormData({ username: "", password: "" });
        } else {
          setError("User not found. Please sign up first.");
        }
      } else {
        setError("Login failed");
      }
    } catch {
      setError("Network error. Please check if the API server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="signin-username"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Username or Email
        </label>
        <input
          type="text"
          id="signin-username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter username or email"
        />
      </div>

      <div>
        <label
          htmlFor="signin-password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="signin-password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? "Please wait..." : "Sign In"}
      </button>
    </form>
  );
}
