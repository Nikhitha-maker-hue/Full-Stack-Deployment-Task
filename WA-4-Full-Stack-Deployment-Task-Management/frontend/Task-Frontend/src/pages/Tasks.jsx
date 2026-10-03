import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { taskApi } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.getAll();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (status === "completed") return tasks.filter((task) => Boolean(task.completed));
    if (status === "pending") return tasks.filter((task) => !Boolean(task.completed));
    return tasks;
  }, [tasks, status]);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    setDeletingId(id);
    setError("");
    try {
      await taskApi.remove(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR WORKSPACE</div>
          <h1>My Tasks</h1>
          <p className="muted">Create, track and update your tasks using the WA-2 REST API.</p>
        </div>
        <Link className="button button-primary" to="/tasks/new">+ New task</Link>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" role="group" aria-label="Task filter">
          {["all", "pending", "completed"].map((item) => (
            <button
              key={item}
              className={status === item ? "filter active" : "filter"}
              onClick={() => setStatus(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <span className="task-count">{filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}</span>
      </div>

      <ErrorMessage message={error} onRetry={loadTasks} />

      {loading ? (
        <Loading label="Fetching your tasks..." />
      ) : filteredTasks.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">✓</div>
          <h2>{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h2>
          <p className="muted">
            {tasks.length === 0 ? "Create your first task to get started." : "Try another filter."}
          </p>
          {tasks.length === 0 && <Link className="button button-primary" to="/tasks/new">Create a task</Link>}
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-card-top">
                <span className={task.completed ? "status status-done" : "status status-pending"}>
                  {task.completed ? "Completed" : "Pending"}
                </span>
                <span className="task-id">#{task.id}</span>
              </div>
              <h2>{task.title}</h2>
              <p>{task.description || "No description provided."}</p>
              <div className="task-actions">
                <Link className="button button-secondary" to={`/tasks/${task.id}`}>View</Link>
                <Link className="button button-secondary" to={`/tasks/${task.id}/edit`}>Edit</Link>
                <button
                  className="button button-danger"
                  onClick={() => deleteTask(task.id)}
                  disabled={deletingId === task.id}
                >
                  {deletingId === task.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}