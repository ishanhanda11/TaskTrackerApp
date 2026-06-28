import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      if (status) {
        params.append("status", status);
      }

      if (priority) {
        params.append("priority", priority);
      }

      if (sort) {
        params.append("sort", sort);
      }

      const { data } = await api.get(`/tasks?${params.toString()}`);

      setTasks(data.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch, status, priority, sort]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("token");
      setUser(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome, {user?.name}
          </h1>

          <p className="text-gray-500">Manage your tasks</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded self-start md:self-auto"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">All Status</option>

            <option value="Pending">Pending</option>

            <option value="Completed">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">All Priorities</option>

            <option value="Low">Low</option>

            <option value="Medium">Medium</option>

            <option value="High">High</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="newest">Newest</option>

            <option value="oldest">Oldest</option>

            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <div>
        {tasks.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-2xl font-bold">No tasks yet</h2>

            <p className="text-gray-500 mt-2">Create your first task above.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              fetchTasks={fetchTasks}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
