import { Minus, Square, X } from "lucide-react";
import "./WindowBar.css";

export default function WindowBar() {
  return (
    <header className="window-bar">
      <div className="window-title">Vertex</div>

      <div className="window-controls">
        <button
          id="window-minimize"
          type="button"
          className="window-control"
          onClick={() => window.electronAPI.minimize()}
          aria-label="Minimize"
        >
          <Minus size={15} strokeWidth={2} />
        </button>

        <button
          id="window-maximize"
          type="button"
          className="window-control"
          onClick={() => window.electronAPI.maximize()}
          aria-label="Maximize"
        >
          <Square size={13} strokeWidth={2} />
        </button>

        <button
          id="window-close"
          type="button"
          className="window-control window-close"
          onClick={() => window.electronAPI.close()}
          aria-label="Close"
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
