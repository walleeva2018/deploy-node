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
      console.log('inside it')
      const response = await fetch(`${apiBaseUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        onSignInSuccess(userData);
        setFormData({ username: "", password: "" });
      } else {
        setError(data.error || "Login failed");
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
          className="block text-sm font-medium text-black mb-2"
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
          className="block text-sm font-medium text-black mb-2"
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