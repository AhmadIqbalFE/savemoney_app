import { useEffect } from "react";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";

export default function Intro({ onFinish }) {
  //Language
  const language = localStorage.getItem("language") || "id";
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-500">
      <div className="text-center">
        <span className="text-green-700 text-4xl uppercase font-extrabold font-inter italic">
          Cash
        </span>
        <span className="text-orange-400 text-3xl font-semibold"> in.</span>
        <p className="text-cyan-100 mt-5">Finance Tracker App</p>
        <p className="text-[10px] text-cyan-100">created by amd_ibl</p>
      </div>
    </div>
  );
}
