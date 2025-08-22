import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  apiBaseUrl: string;
}

export default function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
  apiBaseUrl,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!editData.title.trim()) return;

    setIsUpdating(true);

    try {
      const response = await fetch(`${apiBaseUrl}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title.trim(),
          description: editData.description.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onTaskUpdated(data.task);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`${apiBaseUrl}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onTaskUpdated(data.task);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/tasks/${task._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onTaskDeleted(task._id);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        task.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`text-lg font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {task.description && (
            <p
              className={`text-gray-600 mb-3 ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="text-xs text-gray-500 mb-3">
            <p>Created: {formatDate(task.createdAt)}</p>
            {task.updatedAt !== task.createdAt && (
              <p>Updated: {formatDate(task.updatedAt)}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleComplete}
              disabled={isUpdating}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                task.completed
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isUpdating
                ? "..."
                : task.completed
                ? "Mark Pending"
                : "Mark Complete"}
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
