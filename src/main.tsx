import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auth token cleanup is handled by useAuth hook's error recovery
// Do NOT clear tokens here — it destroys valid sessions on navigation

createRoot(document.getElementById("root")!).render(<App />);
