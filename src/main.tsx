import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aggressively clear any Supabase auth tokens to prevent infinite refresh loops
try {
  Object.keys(localStorage)
    .filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    .forEach(k => {
      localStorage.removeItem(k);
      console.log('Cleared Supabase auth token:', k);
    });
} catch (e) {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
