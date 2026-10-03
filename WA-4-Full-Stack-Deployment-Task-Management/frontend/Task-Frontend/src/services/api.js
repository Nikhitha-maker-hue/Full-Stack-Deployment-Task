const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("taskflow_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error("Unable to connect to the API. Check the backend URL and your internet connection.");
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // Keep an empty object for non-JSON responses.
  }

  if (!response.ok) {
    const validationMessage = Array.isArray(data.errors)
      ? data.errors.map((error) => error.msg).join(", ")
      : "";

    throw new Error(
      validationMessage || data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

export const taskApi = {
  getAll: () => request("/tasks"),

  getById: (id) => request(`/tasks/${id}`),

  create: (payload) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  update: (id, payload) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  remove: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE"
    })
};