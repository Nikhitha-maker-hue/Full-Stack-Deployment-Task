import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="empty-card page">
      <div className="empty-icon">?</div>
      <h1>Page not found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <Link className="button button-primary" to="/tasks">Go to tasks</Link>
    </section>
  );
}