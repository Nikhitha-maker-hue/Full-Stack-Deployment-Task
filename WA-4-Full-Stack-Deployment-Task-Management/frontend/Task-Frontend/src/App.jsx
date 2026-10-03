import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import TaskForm from "./pages/TaskForm";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}