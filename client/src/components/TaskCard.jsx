import api from "../services/api";
import toast from "react-hot-toast";

function TaskCard({
  task,
  fetchTasks,
  editingTask,
  setEditingTask,
}) {
  const handleDelete = async () => {
  try {
    await api.delete(`/tasks/${task._id}`);

    if (
      editingTask &&
      editingTask._id === task._id
    ) {
      setEditingTask(null);
    }

    toast.success("Task deleted");

    fetchTasks();
  } catch (error) {
    toast.error("Failed to delete task");
  }
};

  const handleToggle = async () => {
    try {
      await api.patch(
        `/tasks/${task._id}/toggle`
      );

      toast.success("Task updated");

      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            {task.title}
          </h2>

          {task.description && (
            <p className="text-gray-600 mt-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                task.status === "Completed"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            >
              {task.status}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                task.priority === "High"
                  ? "bg-red-500"
                  : task.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.dueDate && (
            <p className="mt-4 text-gray-500">
              Due:
              <span className="ml-2">
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              setEditingTask(task)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={handleToggle}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {task.status === "Completed"
              ? "Undo"
              : "Complete"}
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;