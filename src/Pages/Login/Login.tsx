import "./Login.css";
import logoImg from "../../assets/logo.png";
import { useState } from "react";
import { getMe, LoginUser } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const getMyData = async () => {
    getMe().then((data: any) => {
      setUser(data);
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await LoginUser({
        login,
        password,
      });
      await getMyData();
      navigate("/main/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";

      if (message === "notfound") {
        setError("User with this login was not found.");
      } else if (message === "incorrect") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Unable to sign in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="left">
        <div className="title">
          <img src={logoImg} alt="Logo" />
          <p>Vertex WorkSpace</p>
        </div>
        <div className="main-info">
          <p className="subtitle">Business Management Platform</p>
          <h1>Управляй проектами, командой и заказами с ясностью.</h1>
          <p>
            CRM для растущих компаний. Отслеживай проекты, назначай задачи,
            управляй командой и держи каждый заказ под контролем.
          </p>
        </div>
        <p className="copyright">
          © 2026 Vertex WorkSpace. All rights reserved.
        </p>
      </div>
      <div className="right">
        <h1>Wellcome</h1>
        <form onSubmit={handleLogin} action="">
          {error && (
            <div className="login-alert" role="alert" aria-live="assertive">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}
          <label htmlFor="login">
            <p>Login</p>
            <input
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError("");
              }}
              placeholder="login123"
              type="text"
              name="login"
              id="login"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="********"
              type="password"
              name="password"
              id="password"
            />
          </label>
          <button id="login-submit" className="primary-btn" type="submit" disabled={loading}>
            {!loading ? "Login →" : "Loading..."}
          </button>
        </form>
      </div>
    </div>
  );
}
