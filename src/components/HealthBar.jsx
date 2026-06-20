import { useEffect, useState } from "react";

export default function HealthBar({ label, pct, color }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  
  useEffect(() => {
    const checkTheme = () => {
      setDarkMode(
        localStorage.getItem("theme") === "dark"
      );
    };
    checkTheme();
    window.addEventListener("storage", checkTheme);
    const interval = setInterval(checkTheme, 300);
    return () => {
      window.removeEventListener(
        "storage",
        checkTheme
      );
      clearInterval(interval);
    };
  }, []);

  const colors = {
    red: {
      bar: "bg-rose-500",
      text: "text-rose-600",
    },

    green: {
      bar: "bg-emerald-500",
      text: "text-emerald-600",
    },

    blue: {
      bar: "bg-blue-500",
      text: "text-blue-600",
    },

    amber: {
      bar: "bg-amber-500",
      text: "text-amber-600",
    },
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-400 w-24 shrink-0">
        {label}
      </span>

      <div className={`flex-1 h-1.5 ${darkMode ? "bg-stone-900" : "bg-stone-100"} rounded-full overflow-hidden`}>
        <div className={`h-full rounded-full ${colors[color].bar}`} style={{ width: `${pct}%` }}/>
      </div>

      <span className={`text-xs font-medium w-8 text-right ${colors[color].text}`}>
        {pct}%
      </span>
    </div>
  );
}