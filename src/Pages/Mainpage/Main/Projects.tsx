import { useEffect, useState } from "react";
import ProjectTr from "../../../Components/ProjectTr";
import Modal from "../../../Components/Modal";
import { createProjcet, getAllProjects } from "../../../api/projects.api";
import type {
  createProjectType,
  ProjectType,
} from "../../../types/project.types";
import Loader from "../../../Components/Loader";
import { useAuthStore } from "../../../store/auth.store";
import {
  alertNotificaction,
  errorNotification,
  succesfullNotification,
} from "../../../Notifications/notification";

export default function Projects() {
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filters = ["All", "New", "In Progress", "Done"];

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  // Сreate Project
  const [clientName, setClientname] = useState("");
  const [projectName, setProjectName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const data: ProjectType[] = await getAllProjects();

        setProjects(data || []);
        console.log(data);
      } catch (err) {
        if (err instanceof Error) {
          console.log("MESSAGE:", err.message);
          errorNotification(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      clientName.trim() === "" ||
      clientContact.trim() === "" ||
      mapUrl.trim() === "" ||
      projectName.trim() === ""
    ) {
      alertNotificaction("Fill in all input fields.");
      return;
    }

    const newProject: createProjectType = {
      client_name: clientName,
      client_contact: clientContact,
      map_url: mapUrl,
      name: projectName,
      client_message: "hi",
    };

    try {
      await createProjcet(newProject);

      const refreshedProjects: ProjectType[] = await getAllProjects();

      setProjects(refreshedProjects || []);

      succesfullNotification("Project created");
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);

      if (err instanceof Error) {
        console.log("MESSAGE:", err.message);
        errorNotification(err.message);
      }
    } finally {
      setClientname("");
      setClientContact("");
      setMapUrl("");
      setProjectName("");
    }
  };
  if (loading) {
    return <Loader />;
  }
  const filteredProjects = projects.filter((project: ProjectType) => {
    if (activeFilter === "All") {
      return true;
    }

    if (activeFilter === "New") {
      return project.status === "new";
    }

    if (activeFilter === "In Progress") {
      return project.status === "inprogress";
    }

    if (activeFilter === "Done") {
      return project.status === "done";
    }

    return true;
  });
  return (
    <section className="projects">
      <div className="dash-head">
        <div className="filter">
          <input
            id="finder"
            type="text"
            placeholder="Search by title or client..."
          />

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

        <button
          style={!isAdmin ? { display: "none" } : { display: "block" }}
          onClick={() => setIsModalOpen(true)}
          className="primary-btn"
        >
          New Project
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Finished</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p: ProjectType) => (
              <ProjectTr key={p.id} p={p} />
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create new project</h2>
        <form onSubmit={handleCreateProject} id="newProject">
          <label htmlFor="projectname">
            <p>Project Name</p>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              type="text"
              id="projectName"
              placeholder="Restaurant CRM"
            />
          </label>
          <label htmlFor="clientname">
            <p>Client Name</p>
            <input
              value={clientName}
              onChange={(e) => setClientname(e.target.value)}
              type="text"
              id="clientname"
              placeholder="DVM Corp."
            />
          </label>
          <label htmlFor="contact">
            <p>Client contact</p>
            <input
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              type="text"
              id="clientcontact"
              placeholder="test@mail.com"
            />
          </label>
          <label htmlFor="mapurl">
            <p>MapUrl</p>
            <input
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              type="url"
              id="mapurl"
              placeholder="https://maps.app.goo.gl/..."
            />
          </label>
          <button type="submit" className="primary-btn">
            Save
          </button>
        </form>
      </Modal>
    </section>
  );
}
