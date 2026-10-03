import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { taskApi } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTask = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.getById(id);
      setTask(data.task);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const remove = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskApi.remove(id);
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <section className="page"><Loading label="Loading task details..." /></section>;

  return (
    <section className="page narrow-page">
      <Link className="back-link" to="/tasks">← Back to tasks</Link>
      <ErrorMessage message={error} onRetry={loadTask} />

      {task && (
        <article className="detail-card">
          <div className="task-card-top">
            <span className={task.completed ? "status status-done" : "status status-pending"}>
              {task.completed ? "Completed" : "Pending"}
            </span>
            <span className="task-id">Task #{task.id}</span>
          </div>

          <h1>{task.title}</h1>
          <p className="detail-description">{task.description || "No description provided."}</p>

          <dl className="metadata">
            <div><dt>Created</dt><dd>{task.created_at || "—"}</dd></div>
            <div><dt>Updated</dt><dd>{task.updated_at || "—"}</dd></div>
            <div><dt>Owner ID</dt><dd>{task.user_id}</dd></div>
          </dl>

          <div className="task-actions">
            <Link className="button button-primary" to={`/tasks/${task.id}/edit`}>Edit task</Link>
            <button className="button button-danger" onClick={remove}>Delete task</button>
          </div>
        </article>
      )}
    </section>
  );
}