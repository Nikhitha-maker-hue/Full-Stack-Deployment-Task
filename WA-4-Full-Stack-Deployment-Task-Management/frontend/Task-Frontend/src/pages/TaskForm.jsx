import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { taskApi } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const initialForm = { title: "", description: "", completed: false };

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      try {
        const data = await taskApi.getById(id);
        setForm({
          title: data.task?.title || "",
          description: data.task?.description || "",
          completed: Boolean(data.task?.completed)
        });
      } catch (error) {
        setServerError(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit]);

  const validate = () => {
    const next = {};
    const title = form.title.trim();

    if (!title) next.title = "Task title is required.";
    else if (title.length < 3) next.title = "Title must be at least 3 characters.";
    else if (title.length > 120) next.title = "Title must be 120 characters or less.";

    if (form.description.trim().length > 500)
      next.description = "Description must be 500 characters or less.";

    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        completed: Boolean(form.completed)
      };

      const data = isEdit
        ? await taskApi.update(id, payload)
        : await taskApi.create(payload);

      navigate(`/tasks/${data.task.id}`);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <section className="page"><Loading label="Loading task..." /></section>;

  return (
    <section className="page narrow-page">
      <Link className="back-link" to={isEdit ? `/tasks/${id}` : "/tasks"}>← Cancel</Link>

      <div className="form-card">
        <div className="eyebrow">{isEdit ? "UPDATE TASK" : "NEW TASK"}</div>
        <h1>{isEdit ? "Edit task" : "Create a task"}</h1>
        <p className="muted">
          {isEdit ? "Update the task and save your changes." : "Add a task to your personal workspace."}
        </p>

        <ErrorMessage message={serverError} />

        <form onSubmit={submit} noValidate>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Finish React assignment"
              maxLength={120}
            />
            <span className="input-meta">{form.title.length}/120</span>
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add a short description..."
              rows={6}
              maxLength={500}
            />
            <span className="input-meta">{form.description.length}/500</span>
            {errors.description && <small className="field-error">{errors.description}</small>}
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => setForm({ ...form, completed: e.target.checked })}
            />
            <span>Mark as completed</span>
          </label>

          <div className="form-actions">
            <Link className="button button-secondary" to={isEdit ? `/tasks/${id}` : "/tasks"}>
              Cancel
            </Link>
            <button className="button button-primary" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}