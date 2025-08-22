"use client";

import { useState, useEffect } from "react";
import AuthTabs from "../app/components/AuthTabs";
import Welcome from "../app/components/Welcome";

interface User {
  id: string;
  username: string;
  email: string;
}

const API_BASE_URL = "https://deploy-node-omega.vercel.app";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? (
    <Welcome user={user} onLogout={handleLogout} apiBaseUrl={API_BASE_URL} />
  ) : (
    <AuthTabs onAuthSuccess={handleAuthSuccess} apiBaseUrl={API_BASE_URL} />
  );
}
