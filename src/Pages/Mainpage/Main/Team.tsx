import { useEffect, useState } from "react";
import TeamCard from "../../../Components/WorkerCard";
import { getAllWorkers } from "../../../api/workers.api";
import Loader from "../../../Components/Loader";
import type { createWorkerType, WorkerType } from "../../../types/worker.types";
import Modal from "../../../Components/Modal";
import { createWorker } from "../../../api/auth.api";
import {
  alertNotificaction,
  errorNotification,
  succesfullNotification,
} from "../../../Notifications/notification";

export default function Team() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Admins", "Workers"];
  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("worker");
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateWorker = async (e: any) => {
    e.preventDefault();
    if (
      login.trim() === "" ||
      fullname.trim() === "" ||
      password.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      email.trim() === ""
    ) {
      alertNotificaction("Fill in all required fields.");
      return;
    }
    setCreateLoading(true);
    const newWorker: createWorkerType = {
      login,
      fullname,
      email,
      phone,
      password,
      role: selectedRole,
    };
    try {
      await createWorker(newWorker);
      const refreshWorkers = (await getAllWorkers()) as WorkerType[];
      setWorkers(refreshWorkers || []);
      succesfullNotification("Worker created");
    } catch (err) {
      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    } finally {
      setCreateLoading(false);
      setLogin("");
      setFullname("");
      setPassword("");
      setEmail("");
      setPhone("");
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await getAllWorkers();
        setWorkers(data as WorkerType[]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filtredWorkers = workers.filter((worker: WorkerType) => {
    if (activeFilter === "All") {
      return true;
    }
    if (activeFilter === "Admins") {
      return worker.role === "admin";
    }
    if (activeFilter === "Workers") {
      return worker.role === "worker";
    }
  });

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="team">
      <div className="dash-head">
        <div className="filter">
          <input id="finder" type="text" placeholder="Search by name..." />

          <ul>
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  className={activeFilter === filter ? "active-filter" : ""}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-btn">
          New worker
        </button>
      </div>
      <div className="team-list">
        {filtredWorkers.map((w: WorkerType) => (
          <TeamCard key={w.id} w={w} />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create worker</h2>
        <form onSubmit={handleCreateWorker} action="" id="createWorkerForm">
          <label htmlFor="login">
            <p>Login</p>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              type="text"
              id="workerLogin"
            />
          </label>
          <label htmlFor="login">
            <p>Full name</p>
            <input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              type="text"
              id="workerFullname"
            />
          </label>
          <label htmlFor="login">
            <p>Password</p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="workerPassword"
            />
          </label>
          <div>
            <label htmlFor="workerEmail">
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="workerEmail"
                type="email"
              />
            </label>
            <label htmlFor="workerPhone">
              <p>Phone number</p>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                id="workerPhone"
              />
            </label>
          </div>
          <label htmlFor="workerRole">
            <p>Role</p>
            <div>
              <button
                onClick={() => setSelectedRole("worker")}
                type="button"
                className={
                  selectedRole === "worker" ? "green-btn" : "secondary-btn"
                }
              >
                Worker
              </button>
              <button
                onClick={() => setSelectedRole("admin")}
                type="button"
                className={
                  selectedRole === "admin" ? "green-btn" : "secondary-btn"
                }
              >
                Admin
              </button>
            </div>
          </label>
          <button type="submit" className="primary-btn">
            {!createLoading ? "Save" : "Loading..."}
          </button>
        </form>
      </Modal>
    </section>
  );
}
