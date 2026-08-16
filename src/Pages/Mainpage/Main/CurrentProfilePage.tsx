import {
  AlertCircle,
  CalendarDays,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import { useEffect, useState } from "react";
import type { WorkerType } from "../../../types/worker.types";
import { changePassword, GetOneWorker } from "../../../api/workers.api";
import { formatDateTime } from "../../../tools/FormateDate";
import {
  errorNotification,
  succesfullNotification,
} from "../../../Notifications/notification";

export default function CurrentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [userData, setUserData] = useState<WorkerType>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isMatch = newPassword === confirmPassword;

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    if (!isMatch) {
      errorNotification("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        newPassword,
        oldPassword,
      });

      succesfullNotification("Password was changed");
    } catch (err) {
      if (err instanceof Error) {
        errorNotification(err.message);
      } else {
        errorNotification("Failed to change password");
      }
    } finally {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  useEffect(() => {
    try {
      GetOneWorker(user?.id || "").then((data: WorkerType) => {
        setUserData(data);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <section className="current-profile">
      <div className="current-profile__heading">
        <div>
          <p className="gray-p">Account</p>
          <h1>My profile</h1>
        </div>
        <span
          className={`role ${userData?.role === "worker" ? "worker" : "admin"}`}
        >
          {userData?.role}
        </span>
      </div>

      <div className="current-profile__layout">
        <div className="current-profile__main">
          <article className="current-profile__card">
            <div className="current-profile__card-title">
              <UserRound size={20} />
              <div>
                <h2>Profile information</h2>
                <p className="gray-p">
                  Your account data is managed by an administrator.
                </p>
              </div>
            </div>
            <div className="current-profile__fields">
              <label>
                <span>Full name</span>
                <input defaultValue={userData?.fullname} readOnly />
              </label>
              <label>
                <span>Login</span>
                <input defaultValue={userData?.login} readOnly />
              </label>
              <label>
                <span>Role</span>
                <input defaultValue={userData?.role} readOnly />
              </label>
              <label>
                <span>Telegram ID</span>
                <input
                  defaultValue={String(userData?.telegram_id ?? "")}
                  readOnly
                />
              </label>
            </div>
          </article>

          <article className="current-profile__card">
            <div className="current-profile__card-title">
              <KeyRound size={20} />
              <div>
                <h2>Change password</h2>
                <p className="gray-p">
                  Use a strong password you do not use elsewhere.
                </p>
              </div>
            </div>
            <div className="current-profile__password-fields">
              {isMatch ? (
                ""
              ) : (
                <div className="login-alert" role="alert" aria-live="assertive">
                  <AlertCircle size={19} />
                  <span>Passwords do not match</span>
                </div>
              )}
              <label>
                <span>Current password</span>
                <input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  placeholder="Enter current password"
                />
              </label>
              <label>
                <span>New password</span>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="Create new password"
                />
              </label>
              <label>
                <span>Confirm new password</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Repeat new password"
                />
              </label>
            </div>
            <div className="current-profile__password-actions">
              <p className="gray-p">
                The new password must be at least 8 characters.
              </p>
              <button
                onClick={handleChangePassword}
                className="primary-btn"
                type="button"
              >
                Update password
              </button>
            </div>
          </article>
        </div>

        <div className="current-profile__side">
          <article className="current-profile__summary">
            <div className="current-profile__avatar">JP</div>
            <h2>{userData?.fullname}</h2>
            <p className="gray-p">{userData?.login}</p>
            <span
              className={`role ${userData?.role === "worker" ? "worker" : "admin"}`}
            >
              {userData?.role}
            </span>
          </article>
          <article className="current-profile__account-card">
            <div className="current-profile__account-title">
              <ShieldCheck size={19} />
              <h3>Account status</h3>
            </div>
            <div className="current-profile__active-status">
              <span /> Active
            </div>
            <p>
              <CalendarDays size={17} /> Joined{" "}
              {userData?.created_at ? formatDateTime(userData.created_at) : ""}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
