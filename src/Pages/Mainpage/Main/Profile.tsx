import { BadgeDollarSign, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { updateWorkerType, WorkerType } from "../../../types/worker.types";
import { GetOneWorker, updateWorker } from "../../../api/workers.api";
import { formatDate, formatDateTime } from "../../../tools/FormateDate";
import {
  errorNotification,
  succesfullNotification,
} from "../../../Notifications/notification";

export default function WorkerProfilePage() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const [worker, setWorker] = useState<WorkerType>();
  const [fullname, setFullname] = useState(worker?.fullname || "");
  const [login, setLogin] = useState(worker?.login || "");
  const [phone, setPhone] = useState(worker?.phone || "");
  const [email, setEmail] = useState(worker?.email || "");
  const [role, setRole] = useState(worker?.role || "worker");
  const [telegramId, setTelegramId] = useState(worker?.telegram_id || "");
  const [total, setTotal] = useState(worker?.total || 0);
  const [percent, setPercent] = useState(worker?.percentage || 0);

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const updateData: updateWorkerType = {
      fullname: fullname,
      email: email,
      login: login,
      percentage: Number(percent),
      phone: phone,
      role: role,
      total: Number(total),
    };

    try {
      await updateWorker(workerId || "", updateData);
      succesfullNotification("Worker updated");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    }
  };

  useEffect(() => {
    GetOneWorker(workerId || "")
      .then((data: WorkerType) => {
        setWorker(data);
        setFullname(data.fullname || "");
        setLogin(data.login || "");
        setRole(data.role || "worker");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setTotal(Number(data.total ?? 0));
        setPercent(Number(data.percentage ?? 0));
        setTelegramId(data.telegram_id || "");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [workerId]);

  return (
    <section className="worker-profile">
      <div className="worker-profile__topbar">
        <button
          id="worker-profile-back"
          className="secondary-btn"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <div>
          <p className="gray-p">Team / Employee profile</p>
          <h1>Employee profile</h1>
        </div>
      </div>

      <div className="worker-profile__layout">
        <div className="worker-profile__main">
          <article className="worker-profile__card">
            <div className="worker-profile__card-title">
              <UserRound size={20} />
              <div>
                <h2>Personal information</h2>
                <p className="gray-p">
                  Basic details visible in the workspace.
                </p>
              </div>
            </div>

            <div className="worker-profile__fields">
              <label>
                <span>Fullname</span>
                <input
                  id="fullanme"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </label>
              <label>
                <span>Login</span>
                <input
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Role</span>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="worker">Worker</option>
                </select>
              </label>

              <label>
                <span>Telegram ID</span>
                <input id="telegramId" defaultValue={telegramId} readOnly />
                <small>Telegram ID is displayed for reference.</small>
              </label>
            </div>
          </article>

          <article className="worker-profile__card">
            <div className="worker-profile__card-title">
              <BadgeDollarSign size={20} />
              <div>
                <h2>Compensation</h2>
                <p className="gray-p">
                  Set the employee’s rate and current monthly total.
                </p>
              </div>
            </div>

            <div className="worker-profile__fields worker-profile__fields--two">
              <label>
                <span>Percentage from order</span>
                <div className="worker-profile__input-suffix">
                  <input
                    id="worker-percentage"
                    type="number"
                    value={percent}
                    onChange={(e) => setPercent(Number(e.target.value))}
                    min="0"
                  />
                  <span>%</span>
                </div>
              </label>
              <label>
                <span>Monthly total</span>
                <div className="worker-profile__input-suffix">
                  <span>$</span>
                  <input
                    id="worker-monthly-total"
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </label>
            </div>
          </article>

          <div className="worker-profile__actions">
            <button id="worker-profile-cancel" className="secondary-btn" type="button">
              Cancel
            </button>
            <button
              id="worker-profile-save"
              onClick={handleUpdate}
              className="primary-btn"
              type="button"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="worker-profile__side">
          <article className="worker-profile__summary">
            <div className="worker-profile__avatar">
              {getInitials(fullname ? fullname : "")}
            </div>
            <h2>{fullname}</h2>
            <span className={`role ${role === "worker" ? "worker" : "admin"}`}>
              {role}
            </span>
          </article>

          <article className="worker-profile__meta">
            <div className="worker-profile__meta-title">
              <ShieldCheck size={19} />
              <h3>Account details</h3>
            </div>
            <dl>
              <div>
                <dt>Worker ID</dt>
                <dd>{worker?.id}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>
                  {worker?.created_at ? formatDate(worker.created_at) : ""}
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>
                  {worker?.updated_at ? formatDateTime(worker?.updated_at) : ""}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
