import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { translations } from "../data/translations";
import { LanguageProvider } from "../context/LanguageContext";

export default function Notification({ show, message, type = "success" }) {
  //Languages
  const language = localStorage.getItem("language") || "id";
  const t = translations[language];

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-index-[9999]
        transition-all duration-500 ease-out
        ${
          show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-5 scale-95 pointer-events-none"
        }
      `}
    >
      <div
        className={`
          flex items-center gap-3
          min-w-70 max-w-sm
          px-5 py-4
          rounded-2xl
          shadow-2xl
          backdrop-blur-md
          border
          ${
            type === "success"
              ? "bg-emerald-500/95 border-emerald-400"
              : "bg-red-500/95 border-red-400"
          }
          text-white
        `}
      >
        <div className="text-xl">
          <FontAwesomeIcon
            icon={type === "success" ? faCircleCheck : faCircleXmark}
          />
        </div>

        <div className="flex-1">
          <p className="font-semibold">
            {type === "success" ? t.success : t.fail}
          </p>

          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
}
