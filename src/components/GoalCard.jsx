import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";

//Languages: moved into component (hooks must be called inside components)

const colorMap = {
  blue: {
    bar: "bg-blue-500",
    pct: "text-blue-600",
    ring: "ring-blue-200",
    icon: "bg-blue-50",
  },

  green: {
    bar: "bg-emerald-500",
    pct: "text-emerald-600",
    ring: "ring-emerald-200",
    icon: "bg-emerald-50",
  },

  amber: {
    bar: "bg-amber-500",
    pct: "text-amber-600",
    ring: "ring-amber-200",
    icon: "bg-amber-50",
  },

  purple: {
    bar: "bg-violet-500",
    pct: "text-violet-600",
    ring: "ring-violet-200",
    icon: "bg-violet-50",
  },
};

function fmt(n, language) {
  const abs = Math.abs(n);

  if (abs >= 1000000) {
    return (
      (abs / 1000000)
        .toFixed(1)
        .replace(".0", "") + 
        (language === "id" ? " jt" : " M")
    );
  }

   if (abs >= 1000) {
    return (
      (abs / 1000)
        .toFixed(0) +
      (language === "id" ? " rb" : " K")
    );
  }
  return abs.toLocaleString(
    language === "id" ? "id-ID" : "en-US"
  );
}

export default function GoalCard({ goal, onDelete, }) {
  const { language } = useLanguage();
  const t = translations[language];
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

  const pct = Math.round(
    (goal.current / goal.target) * 100);
  const c = colorMap[goal.color] || colorMap.blue;

  return (
    <div className={`${darkMode ? "bg-stone-900" : "bg-white"} rounded-2xl p-4 ring-1 ${c.ring} ring-opacity-60 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center text-lg`}>
          {goal.icon}
        </div>

        {onDelete && (
          <button onClick={() => onDelete(goal.id)} className={`w-7 h-7 rounded-lg ${darkMode ? "bg-stone-900" : "bg-white"} ${darkMode ? "hover:bg-stone-700" : "hover:bg-stone-50"} flex items-center justify-center transition-all`}>
            <FontAwesomeIcon icon={faTrash} className={`${darkMode ? "text-stone-600" : "text-stone-200"} hover:text-red-400 text-xs`}/>
          </button>
        )}
      </div>

      <p className={`text-sm font-semibold ${darkMode ? "text-stone-100" : "text-stone-700"} mb-2`}>
        {goal.name}
      </p>

      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }}/>
      </div>

      <p className={`text-xs ${darkMode ? "text-stone-200" : "text-stone-400"}`}>
        {t.rp} {fmt(goal.current, language)} {t.from} {t.rp}{" "}
        {fmt(goal.target, language)}
      </p>
    </div>
  );
}