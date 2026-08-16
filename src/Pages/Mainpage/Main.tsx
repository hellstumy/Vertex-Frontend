import "./Main.css";
import logoImg from "../../assets/logo.png";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  SquareCheckBig,
  User,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
export default function MainPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };
  console.log(user);
  const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replaceAll("-", " ")
    .replace(/^./, (char) => char.toUpperCase());
  return (
    <div className="main-page">
      
      <aside>
        <div className="aside-head">
          <img src={logoImg} alt="Logo" />
          Vertex
        </div>
        <nav>
          <NavLink
            to="/main/dashboard"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            <LayoutDashboard />
            Dashboard
          </NavLink>

          <NavLink
            to="/main/projects"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            <FolderKanban />
            Projects
          </NavLink>
          <NavLink
            to="/main/tasks"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            <SquareCheckBig />
            Tasks
          </NavLink>
          <NavLink
            style={!isAdmin ? { display: "none" } : { display: "flex" }}
            to="/main/team"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            <Users />
            Team
          </NavLink>
          <NavLink
            to="/main/settings"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            <Settings />
            Settings
          </NavLink>
        </nav>
        <div className="profile-section">
          <div className="profile-btn">
            <User color="#51A2FF" />
            <NavLink to="/main/profile">
              <h3>{user?.login}</h3>
            </NavLink>
            <button onClick={handleLogout}>
              <LogOut color="#45556C" />
            </button>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div className="fake-link">
            <p className="gray-p">
              Vertex /{" "}
              <span className="small-p">
                {location.pathname.split("/").pop()?.replace("-", " ")}
              </span>
            </p>
          </div>
          <h2>{pageName}</h2>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
