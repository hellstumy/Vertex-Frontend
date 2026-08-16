import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/Login/Login";
import MainPage from "./Pages/Mainpage/Main";
import Dashboard from "./Pages/Mainpage/Main/Dashboard";
import Projects from "./Pages/Mainpage/Main/Projects";
import Tasks from "./Pages/Mainpage/Main/Tasks";
import Team from "./Pages/Mainpage/Main/Team";
import Settings from "./Pages/Mainpage/Main/Setting";
import WorkerProfilePage from "./Pages/Mainpage/Main/Profile";
import CurrentProfilePage from "./Pages/Mainpage/Main/CurrentProfilePage";
import ProjectInfoPage from "./Pages/Info/ProjectInfoPage";
import TaskInfoPage from "./Pages/Info/TaskInfoPage";
import SuccesNotification from "./Notifications/SuccesNotification";
import ErrorNotification from "./Notifications/ErrorNotification";
import AlertNotification from "./Notifications/AletrNotification";
import WindowBar from "./Components/WindowBar";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/main/dashboard" replace />;
  }

  return <Outlet />;
}

function App() {
  const isAuth = localStorage.getItem("token");

  return (
    <>
      <WindowBar />

      <div className="app-content">
        <div className="notification_block">
          <SuccesNotification />
          <ErrorNotification />
          <AlertNotification />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              isAuth ? (
                <Navigate to="/main/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/main" element={<MainPage />}>
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="projects">
                <Route index element={<Projects />} />
                <Route path=":projectId" element={<ProjectInfoPage />} />
              </Route>

              <Route path="tasks">
                <Route index element={<Tasks />} />
                <Route path=":taskId" element={<TaskInfoPage />} />
              </Route>

              <Route path="team">
                <Route index element={<Team />} />
                <Route path=":workerId" element={<WorkerProfilePage />} />
              </Route>

              <Route path="settings" element={<Settings />} />

              <Route path="profile" element={<CurrentProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
