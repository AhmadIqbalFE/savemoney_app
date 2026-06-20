import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { translations } from "../data/translations";

export default function Navbar({
  navItems,
  activeNav,
  setActiveNav,
}){
//Languages
const [language, setLanguage] = useState(
  localStorage.getItem("language") || "id"
);

useEffect(() => {
  const checkLanguage = () => {
    setLanguage(
      localStorage.getItem("language") || "id"
    );
  };
  checkLanguage();
  window.addEventListener("storage", checkLanguage);

  const interval = setInterval(checkLanguage, 300);
  return () => {
    window.removeEventListener(
      "storage",
      checkLanguage
    );
    clearInterval(interval);
  };
}, []);

const t = translations[language];

const navLabels = {
  home: t.homenav,
  report: t.reportnav,
  add: t.addnav,
  goals: t.goalsnav,
  setting: t.settingnav,
};

//DarkMode
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
useEffect(() => {
  const checkTheme = () => {
    setDarkMode(
      localStorage.getItem("theme") === "dark"
    );
  };

  const interval = setInterval(
    checkTheme,
    200
  );
  return () => clearInterval(interval);
}, []);

  return (
    <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${darkMode ? "bg-stone-950" : "bg-white"} border-t ${darkMode ? "border-stone-800" : "border-stone-100"} px-2 pt-3 pb-6 flex justify-around z-10`}>
      {navItems.map((item, i) => (
        <button
          key={i}
          onClick={() => setActiveNav(i)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
            activeNav === i
              ? "text-cyan-500"
              :darkMode
              ? "text-stone-400"
              : "text-cyan-300"
          }`}>
          {i === 2 ? (
            <div className={`w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center -mt-6 shadow-lg ${darkMode ? "shadow-sky-500" : "shadow-sky-300"}`}>
              <span className="text-xl text-white">
                <FontAwesomeIcon icon={item.icon} className="text-xl"/>
              </span>
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={item.icon} className="text-xl"/>
              <span className="text-[15px] font-medium">
                {navLabels[item.key]}
              </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}