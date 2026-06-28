import { categories } from "../data/categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";

function fmt(n) {
  const abs = Math.abs(n);

  if (abs >= 1000000) {
    return (abs / 1000000).toFixed(1).replace(".0", "") + " jt";
  }

  if (abs >= 1000) {
    return (abs / 1000).toFixed(0) + " rb";
  }

  return abs.toLocaleString("id-ID");
}

export default function TxnRow({ txn, onClick }) {
  //Language
  const { language } = useLanguage();
  const t = translations[language];

  //Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const checkTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };
    checkTheme();
    window.addEventListener("storage", checkTheme);
    const interval = setInterval(checkTheme, 300);
    return () => {
      window.removeEventListener("storage", checkTheme);
      clearInterval(interval);
    };
  }, []);

  //Category
  const selectedCategory = categories.find((cat) => cat.key === txn.category);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-4 border-b ${
        darkMode ? "border-stone-800" : "border-stone-100"
      } last:border-0 cursor-pointer active:scale-[0.98] transition-all`}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            selectedCategory?.color || "bg-stone-100"
          }`}
        >
          <FontAwesomeIcon
            icon={selectedCategory?.icon}
            className={`text-lg ${
              selectedCategory?.iconColor || "text-stone-500"
            }`}
          />
        </div>

        <div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-stone-100" : "text-stone-700"
            }`}
          >
            {txn.name}
          </p>

          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs ${
                darkMode ? "text-stone-200" : "text-stone-600"
              }`}
            >
              {t[selectedCategory?.key]}
            </span>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                darkMode ? "bg-purple-300" : "bg-purple-100"
              } ${darkMode ? "text-stone-700" : "text-stone-900"} font-medium`}
            >
              {txn.date}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            txn.type === "in" ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {txn.type === "in" ? "+" : "-"}Rp {fmt(txn.amount)}
        </p>
      </div>
    </div>
  );
}
