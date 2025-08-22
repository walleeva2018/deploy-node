import { useState } from "react";
import TaskItem from "./TaskItem";

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

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  apiBaseUrl: string;
  stats: TaskStats;
}

export default function TaskList({
  tasks,
  onTaskUpdated,
  onTaskDeleted,
  apiBaseUrl,
  stats,
}: TaskListProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      default:
        return true;
    }
  });

  const getFilterButtonClass = (filterType: string) => {
    return `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      filter === filterType
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Task Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {stats.total > 0 && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {Math.round((stats.completed / stats.total) * 100)}% Complete
            </p>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={getFilterButtonClass("all")}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={getFilterButtonClass("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={getFilterButtonClass("completed")}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Task Items */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              No {filter === "all" ? "" : filter} tasks found.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
              apiBaseUrl={apiBaseUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
