import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setServerError("");
    setSuccess("");
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await authApi.register(form);
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">GET STARTED</div>
        <h1>Create your account</h1>
        <p className="muted">Register to create and manage your personal tasks.</p>

        <ErrorMessage message={serverError} />
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit} noValidate>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              autoComplete="name"
            />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <button className="button button-primary button-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}