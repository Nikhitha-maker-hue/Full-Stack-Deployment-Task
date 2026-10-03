export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert alert-error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="button button-small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}