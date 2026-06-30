import {
  faBullseye,
  faArrowTrendUp,
  faTrophy,
  faRobot,
  faAward,
  faX,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoalCard from "../components/GoalCard";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";
import { translations } from "../data/translations";
import { useLanguage } from "../context/LanguageContext";
import Notification from "../components/Notifications";

export default function Goals({ goals = [] }) {
  //Languages
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

    const interval = setInterval(checkTheme, 200);
    return () => clearInterval(interval);
  }, []);

  //Notifications
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  function showNotification(message, type = "success") {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  }

  //Update Target Aktif
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newProgress, setNewProgress] = useState("");
  async function handleUpdateProgress(e) {
    e.preventDefault();

    const updatedCurrent =
      Number(selectedGoal.current || 0) + Number(newProgress);

    const { error } = await supabase
      .from("goals")
      .update({
        current: updatedCurrent,
        completed_at: updatedCurrent >= selectedGoal.target ? new Date() : null,
      })
      .eq("id", selectedGoal.id);

    if (error) {
      console.log(error);
      showNotification(t.showfail, "error");
      return;
    }
    showNotification(t.showsuccess);
    setSelectedGoal(null);
    setNewProgress("");
  }

  //Sistem Total Target
  const totalTarget = (goals || []).reduce(
    (sum, goal) => sum + Number(goal.target || 0),
    0
  );

  const avgProgress =
    (goals || []).length > 0
      ? Math.round(
          goals.reduce((sum, goal) => {
            return (
              sum + (Number(goal.current || 0) / Number(goal.target || 1)) * 100
            );
          }, 0) / goals.length
        )
      : 0;

  //Menu Achievements
  const completedAchievements = (goals || []).filter((goal) => {
    if (Number(goal.current) < Number(goal.target)) {
      return false;
    }

    if (!goal.completed_at) {
      return false;
    }

    const completedTime = new Date(goal.completed_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - completedTime) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  //Menu Add Goals
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    current: "",
    color: "blue",
    icon: "🎯",
  });

  async function handleAddGoal(e) {
    e.preventDefault();

    // Pengecekan form
    if (!goalForm.name || !goalForm.target || !goalForm.icon) {
      showNotification(t.addgoalcheck);
      return;
    }

    const { error } = await supabase.from("goals").insert([
      {
        name: goalForm.name,
        target: Number(goalForm.target),
        current: Number(goalForm.current),
        color: goalForm.color,
        icon: goalForm.icon,
      },
    ]);

    if (error) {
      console.log(error);
      showNotification(t.addgoalfail);
      return;
    }

    showNotification(t.addgoalsuccess);
    setShowAddGoal(false);
  }

  async function handleDeleteGoal(id) {
    const confirmDelete = confirm(t.deletegoalcheck);

    if (!confirmDelete) return;

    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) {
      console.log(error);
      showNotification(t.deletegoalfail);
      return;
    }

    showNotification(t.deletegoalsuccess);
  }

  return (
    <>
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-stone-950" : "bg-stone-50"
        } flex justify-center`}
      >
        <div className="w-full max-w-md pb-24">
          {/* Header */}
          <div
            className={`${
              darkMode ? "bg-stone-900" : "bg-white"
            } px-5 pt-8 pb-5 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-400 uppercase tracking-wide font-medium">
                  {t.finantarget}
                </p>

                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-stone-100" : "text-stone-800"
                  } mt-1`}
                >
                  {t.yourgoals}{" "}
                  <FontAwesomeIcon
                    icon={faArrowTrendUp}
                    className="text-3xl text-emerald-600"
                  />
                </h1>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mx-4 mt-4">
            <div
              className={`${
                darkMode
                  ? "bg-linear-to-br from-cyan-900 to-stone-900"
                  : "bg-linear-to-br from-cyan-500 to-blue-600"
              } rounded-2xl p-5 text-white`}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-olive-100 text-xs uppercase tracking-wide">
                    {t.totactivtarget}
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {t.rp} {totalTarget.toLocaleString("id-ID")}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBullseye} className="text-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-olive-100 text-[10px] uppercase tracking-wide mb-1">
                    {t.targetfinish}
                  </p>

                  <p className="text-white font-semibold text-sm">
                    {completedAchievements.length} {t.goals}
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-olive-100 text-[10px] uppercase tracking-wide mb-1">
                    {t.avprogress}
                  </p>

                  <p className="text-amber-300 font-semibold text-sm">
                    {avgProgress}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="mx-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-100" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.actgoals}
              </p>

              <div className="flex items-center gap-2">
                {/* Tombol Tambah Menu */}
                <button
                  onClick={() => setShowAddGoal(true)}
                  className={`${darkMode ? "bg-cyan-500" : "bg-cyan-300"} ${
                    darkMode ? "hover:bg-cyan-600" : "hover:bg-cyan-400"
                  } text-white text-xs px-3 py-2 rounded-xl font-medium transition-all`}
                >
                  + {t.add}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {goals
                .filter((goal) => Number(goal.current) < Number(goal.target))
                .map((goal) => (
                  <div key={goal.id} onClick={() => setSelectedGoal(goal)}>
                    <GoalCard goal={goal} onDelete={handleDeleteGoal} />
                  </div>
                ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="mx-4 mt-5">
            <div
              className={`${darkMode ? "bg-stone-900" : "bg-blue-100"} border ${
                darkMode ? "border-stone-800" : "border-sky-200"
              } rounded-2xl p-4`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? "bg-cyan-900" : "bg-blue-600"
                  } flex items-center justify-center text-white shrink-0`}
                >
                  <FontAwesomeIcon
                    icon={faRobot}
                    className={`${
                      darkMode ? "text-cyan-400" : "text-cyan-300"
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        darkMode ? "text-stone-50" : "text-blue-700"
                      }`}
                    >
                      Saran AI
                    </span>

                    <span
                      className={`text-[10px] ${
                        darkMode ? "bg-cyan-900" : "bg-blue-600"
                      } ${
                        darkMode ? "text-stone-100" : "text-blue-100"
                      } px-2 py-0.5 rounded-full font-medium`}
                    >
                      AI
                    </span>
                  </div>

                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-blue-700"
                    } leading-relaxed`}
                  >
                    Jika kamu menabung tambahan Rp 15 rb per hari, target DP
                    Rumah bisa tercapai 4 bulan lebih cepat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement */}
          <div className="mx-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-200" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.achieve}
              </p>
              <FontAwesomeIcon icon={faAward} className="text-amber-400" />
            </div>

            <div
              className={`${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-2xl p-4 mb-3 shadow-sm ring-1 ${
                darkMode ? "ring-stone-800" : "ring-stone-100"
              }`}
            >
              {completedAchievements.length > 0 ? (
                completedAchievements.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between py-3 border-b ${
                      darkMode ? "border-stone-800" : "border-stone-100"
                    } last:border-0`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          darkMode ? "bg-amber-200" : "bg-amber-50"
                        } flex items-center justify-center`}
                      >
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className="text-amber-500"
                        />
                      </div>

                      <div>
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-stone-50" : "text-stone-700"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-stone-100" : "text-stone-400"
                          }`}
                        >
                          {t.yygoals}{" "}
                          <FontAwesomeIcon
                            icon={faGift}
                            className={`text-sm ${
                              darkMode ? "text-red-600" : "text-red-400"
                            }`}
                          />
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-emerald-600">
                      {t.rp} {Number(item.target).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm font-bold text-stone-400">
                    {t.nhachieve}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
            <div
              className={`w-full max-w-sm ${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-3xl p-5 shadow-2xl`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    } uppercase tracking-wide`}
                  >
                    {t.ngoal}
                  </p>

                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-stone-200" : "text-stone-800"
                    } mt-1`}
                  >
                    {t.adgoal}
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddGoal(false)}
                  className={`w-8 h-8 rounded-full ${
                    darkMode
                      ? "bg-stone-300 hover:bg-stone-400"
                      : "bg-stone-100 hover:bg-stone-200"
                  } flex items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faX} className="text-stone-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddGoal} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder={t.gname}
                  value={goalForm.name}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      name: e.target.value,
                    })
                  }
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white placeholder:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                />

                <input
                  type="number"
                  required
                  placeholder={t.nogoal}
                  value={goalForm.target}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      target: e.target.value,
                    })
                  }
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white placeholder:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                />

                <input
                  type="number"
                  required
                  placeholder={t.csaving}
                  value={goalForm.current}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      current: e.target.value,
                    })
                  }
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white placeholder:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                />

                <input
                  type="text"
                  required
                  placeholder={t.icon}
                  value={goalForm.icon}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      icon: e.target.value,
                    })
                  }
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white placeholder:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-800 placeholder:text-stone-400"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                />

                <select
                  value={goalForm.color}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      color: e.target.value,
                    })
                  }
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white option:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-800 option:text-stone-800"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                >
                  <option value="blue">{t.blue}</option>
                  <option value="green">{t.green}</option>
                  <option value="amber">{t.amber}</option>
                  <option value="purple">{t.purple}</option>
                </select>

                <button
                  type="submit"
                  className={`w-full ${
                    darkMode
                      ? "bg-linear-to-r from-cyan-900 to-slate-900"
                      : "bg-linear-to-r from-cyan-500 to-blue-600"
                  } rounded-2xl py-4 text-white font-semibold`}
                >
                  {t.sgoal}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Update Goal Progress Modal */}
        {selectedGoal && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
            <div
              className={`w-full max-w-sm ${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-3xl p-5 shadow-2xl`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    } uppercase tracking-wide`}
                  >
                    {t.upprogress}
                  </p>

                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-stone-200" : "text-stone-800"
                    } mt-1`}
                  >
                    {selectedGoal.name}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedGoal(null)}
                  className={`w-8 h-8 rounded-full ${
                    darkMode
                      ? "bg-stone-300 hover:bg-stone-400"
                      : "bg-stone-100 hover:bg-stone-200"
                  } flex items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faX} className="text- sm" />
                </button>
              </div>

              {/* Info */}
              <div
                className={`${
                  darkMode ? "bg-stone-800" : "bg-stone-50"
                } rounded-2xl p-4 mb-4`}
              >
                <p
                  className={`text-xs ${
                    darkMode ? "text-stone-200" : "text-stone-400"
                  } mb-1`}
                >
                  {t.upprogress}
                </p>

                <p
                  className={`text-lg font-bold ${
                    darkMode ? "text-cyan-800" : "text-cyan-600"
                  }`}
                >
                  {t.rp} {Number(selectedGoal.current).toLocaleString("id-ID")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateProgress} className="space-y-4">
                <input
                  type="number"
                  required
                  placeholder={t.adsaving}
                  value={newProgress}
                  onChange={(e) => setNewProgress(e.target.value)}
                  className={`w-full ${
                    darkMode
                      ? "bg-stone-800 border-stone-700 text-white placeholder:text-stone-300"
                      : "bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400"
                  } border rounded-xl px-4 py-3 text-sm outline-none`}
                />

                <button
                  type="submit"
                  className={`w-full ${
                    darkMode
                      ? "bg-linear-to-r from-cyan-900 to-slate-900"
                      : "bg-linear-to-r from-cyan-500 to-blue-600"
                  } rounded-2xl py-4 text-white font-semibold`}
                >
                  {t.adsaving}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
