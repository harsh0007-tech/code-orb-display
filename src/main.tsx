import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clear stale Supabase auth tokens that cause infinite refresh loops
try {
  const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  if (storageKey) {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const expiresAt = parsed?.expires_at;
      if (expiresAt && expiresAt * 1000 < Date.now()) {
        localStorage.removeItem(storageKey);
        console.log('Cleared expired Supabase auth token');
      }
    }
  }
} catch (e) {
  // If parsing fails, the token is corrupt - remove it
  const storageKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  if (storageKey) localStorage.removeItem(storageKey);
}

createRoot(document.getElementById("root")!).render(<App />);
