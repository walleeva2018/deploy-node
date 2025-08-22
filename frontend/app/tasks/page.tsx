"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

const API_BASE_URL = "https://deploy-node-omega.vercel.app";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/");
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch {
      localStorage.removeItem("user");
      router.push("/");
    }
  }, [router]);

  // Fetch tasks and stats
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchStats();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setTasks(data.tasks);
      } else {
        setError("Failed to fetch tasks");
      }
    } catch {
      setError("Network error while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/stats/${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch {
      console.error("Failed to fetch stats");
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setStats((prev) => ({
      total: prev.total + 1,
      completed: prev.completed,
      pending: prev.pending + 1,
    }));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );

    // Recalculate stats
    const newTasks = tasks.map((task) =>
      task._id === updatedTask._id ? updatedTask : task
    );
    const completed = newTasks.filter((task) => task.completed).length;
    const pending = newTasks.filter((task) => !task.completed).length;

    setStats({
      total: newTasks.length,
      completed,
      pending,
    });
  };

  const handleTaskDeleted = (taskId: string) => {
    const deletedTask = tasks.find((task) => task._id === taskId);
    setTasks((prev) => prev.filter((task) => task._id !== taskId));

    if (deletedTask) {
      setStats((prev) => ({
        total: prev.total - 1,
        completed: deletedTask.completed ? prev.completed - 1 : prev.completed,
        pending: !deletedTask.completed ? prev.pending - 1 : prev.pending,
      }));
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Welcome back, {user.username}!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Task Form */}
        <TaskForm
          onTaskCreated={handleTaskCreated}
          apiBaseUrl={API_BASE_URL}
          userId={user.id}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          apiBaseUrl={API_BASE_URL}
          stats={stats}
        />
      </div>
    </div>
  );
}
