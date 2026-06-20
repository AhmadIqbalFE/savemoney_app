import { faUser, faBell, faMoon, faShieldHalved, faLanguage, faCircleQuestion, faArrowRightFromBracket, faChevronRight, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

export default function Settings() {
//Dark Mode
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);

function handleDarkMode() {
  setDarkMode(!darkMode);
}

//Languages
const { language, setLanguage } = useLanguage();

const t = translations[language];

//Daftar Menu
  const menuItems = [
  {
    key: "profile",
    icon: faUser,
    label: t.profile,
    desc: t.changeprofile,
    color: "bg-blue-50 text-blue-500",
  },

  {
    key: "security",
    icon: faShieldHalved,
    label: t.security,
    desc: t.pinauth,
    color: "bg-emerald-50 text-emerald-500",
  },

  {
    key: "notifications",
    icon: faBell,
    label: t.notifications,
    desc: t.remindalerts,
    color: "bg-amber-50 text-amber-500",
  },

  {
    key: "darkMode",
    icon: faMoon,
    label: t.darkMode,
    desc: t.apptheme,
    color: "bg-violet-50 text-violet-500",
  },

  {
    key: "language",
    icon: faLanguage,
    label: t.language,
    desc: language === "id" ? "Indonesia" : "English",
    color: "bg-cyan-50 text-cyan-500",
  },

  {
    key: "helpCenter",
    icon: faCircleQuestion,
    label: t.helpCenter,
    desc: t.faqsupp,
    color: "bg-rose-50 text-rose-500",
  },
];

  return (
    <div className={`min-h-screen flex justify-center transition-all duration-300 ${darkMode ? "bg-stone-950" : "bg-stone-50"}`}>
      <div className="w-full max-w-md pb-24">

        {/* Header */}
        <div className={` px-5 pt-8 pb-5 shadow-sm ${darkMode ? "bg-stone-900" : "bg-white"}`}>
          <p className="text-xs text-orange-400 uppercase tracking-wide font-medium">
            {t.settings}
          </p>

          <h1 className={`text-2xl font-bold mt-1 ${darkMode ? "text-stone-50" : "text-stone-800"}`}>
            {t.saveChanges}
          </h1>
        </div>

        {/* Profile Card */}
        <div className="mx-4 mt-4">
          <div className={`${darkMode ? "bg-gradient-to-br from-cyan-900 to-stone-900" : "bg-gradient-to-br from-cyan-500 to-blue-600"} rounded-2xl p-5 text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-bold">
                AI
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Ahmad Iqbal
                </h2>

                <p className="text-cyan-100 text-sm">
                  a.iqbal27112005@gmail.com
                </p>
                <div className="mt-2 inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />

                  <span className="text-[10px] font-medium">
                    {t.account}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="mx-4 mt-5">
          <div className={`${darkMode ? "bg-stone-900" : "bg-white"} rounded-2xl shadow-sm ring-1 ${darkMode ? "ring-stone-800" : "ring-stone-100"} overflow-hidden`}>
            {menuItems.map((item) => (
              <button key={item.key || item.label} onClick={() => {
                  if (item.key === "darkMode") {
                    handleDarkMode();
                  }

                  if (item.key === "language") {
                    setLanguage(
                      language === "id" ? "en" : "id"
                    );
                  }
                }} className={`w-full flex items-center justify-between px-4 py-4 border-b ${darkMode ? "border-stone-800" : "border-stone-100"} last:border-0`}>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>

                  <div className="text-left">
                    <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-stone-700"}`}>
                      {item.label}
                    </p>

                    <p className="text-xs text-stone-400">
                      {item.desc}
                    </p>
                  </div>
                </div>

                   {item.key === "darkMode" ? (
                    <div className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${darkMode ? "bg-cyan-500 justify-end" : "bg-stone-300 justify-start"}`}>
                      <div className="w-6 h-6 rounded-full bg-white" />
                    </div>
                  ) : (
                    <FontAwesomeIcon icon={faChevronRight} className="text-stone-300 text-sm"/>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="mx-4 mt-5">
          <div className={`${darkMode ? "bg-stone-900" : "bg-white"} rounded-2xl p-4 shadow-sm ring-1 ${darkMode ? "ring-stone-800" : "ring-stone-100"}`}>
            <div className="flex items-center justify-between mb-3">

              <p className={`text-xs font-semibold ${darkMode ? "text-stone-100" : "text-stone-400"} uppercase tracking-wide`}>
                {t.appinfo}
              </p>

              <span className={`text-xs ${darkMode ? "text-stone-300" : "text-stone-500"}`}>
                V1.0.0
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className={`text-sm ${darkMode ? "text-stone-300" : "text-stone-500"}`}>
                {t.ppolicy}
              </span>

              <FontAwesomeIcon icon={faChevronRight} className="text-stone-300 text-sm"/>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className={`text-sm ${darkMode ? "text-stone-300" : "text-stone-500"}`}>
                {t.termservice}
              </span>

              <FontAwesomeIcon icon={faChevronRight} className="text-stone-300 text-sm"/>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mx-4 mt-5">
          <button className={`w-full ${darkMode ? "bg-rose-200" : "bg-rose-50"} border border-rose-100 rounded-2xl py-4 flex items-center justify-center gap-2 text-rose-500 font-semibold`}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            {t.signOut}
          </button>
        </div>
      </div>
    </div>
  );
}

