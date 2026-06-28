import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function TaskForm({ fetchTasks, editingTask, setEditingTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority || "Medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    });

    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);

        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", formData);

        toast.success("Task created successfully");
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Task no longer exists.");

        resetForm();
        fetchTasks();
        return;
      }
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-2xl font-bold mb-5">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows={4}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="Low">Low</option>

          <option value="Medium">Medium</option>

          <option value="High">High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {loading
              ? editingTask
                ? "Updating..."
                : "Creating..."
              : editingTask
                ? "Update Task"
                : "Create Task"}
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-3 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
