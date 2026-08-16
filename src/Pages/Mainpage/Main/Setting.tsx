import { BellRing, MonitorCog, ShieldCheck } from "lucide-react";

export default function Settings() {
  return (
    <section className="settings-page">
      <div className="settings-page__heading">
        <p className="gray-p">Workspace</p>
        <h1>Settings</h1>
      </div>

      <div className="settings-page__layout">
        <div className="settings-page__main">
          <article className="settings-page__card">
            <div className="settings-page__title">
              <BellRing size={20} />
              <div>
                <h2>Notifications</h2>
                <p className="gray-p">Choose which workspace updates you receive.</p>
              </div>
            </div>
            <div className="settings-page__options">
              <label className="settings-page__option">
                <input type="checkbox" defaultChecked />
                <span><strong>Task updates</strong><small>When a task is assigned, updated, or completed.</small></span>
              </label>
              <label className="settings-page__option">
                <input type="checkbox" defaultChecked />
                <span><strong>Project deadlines</strong><small>Reminders before a project deadline is due.</small></span>
              </label>
              <label className="settings-page__option">
                <input type="checkbox" />
                <span><strong>Weekly summary</strong><small>A summary of active projects and tasks every Monday.</small></span>
              </label>
            </div>
          </article>

          <article className="settings-page__card">
            <div className="settings-page__title">
              <MonitorCog size={20} />
              <div>
                <h2>Display</h2>
                <p className="gray-p">Personalise the way dates and language are shown.</p>
              </div>
            </div>
            <div className="settings-page__selects">
              <label><span>Language</span><select defaultValue="en"><option value="en">English</option><option value="ru">Русский</option></select></label>
              <label><span>Time zone</span><select defaultValue="warsaw"><option value="warsaw">Europe / Warsaw</option><option value="utc">UTC</option></select></label>
            </div>
          </article>
        </div>

        <div className="settings-page__side">
          <ShieldCheck size={24} />
          <h2>Your data is secure</h2>
          <p>Account and workspace permissions are managed separately by your administrator.</p>
          <button className="secondary-btn" type="button">Save preferences</button>
        </div>
      </div>
    </section>
  );
}
