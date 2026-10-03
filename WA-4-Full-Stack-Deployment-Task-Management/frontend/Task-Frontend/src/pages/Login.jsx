import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
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
      const data = await authApi.login(form);
      login(data);
      navigate(location.state?.from || "/tasks", { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Sign in to TaskFlow</h1>
        <p className="muted">Manage your tasks from one simple dashboard.</p>

        <ErrorMessage message={serverError} />

        <form onSubmit={submit} noValidate>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
              autoComplete="current-password"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <button className="button button-primary button-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}