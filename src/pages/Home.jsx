import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";
import Report from "./Report";
import Goals from "./Goals";
import Settings from "./Settings";
import AddTransaction from "./AddTransaction";
import Navbar from "../components/Navbar";
import GoalCard from "../components/GoalCard";
import TxnRow from "../components/TxnRow";
import HealthBar from "../components/HealthBar";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faRobot,
  faArrowRight,
  faX,
  faTrash,
  faPlus,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { navItems } from "../data/dummyData";
import { generateAiMessage } from "../utils/aiCoach";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import Notification from "../components/Notifications";

export default function Home() {
  //User
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  //Username
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    const loadData = async () => {
      await getUser();
      await fetchTransactions();
      await fetchGoals();
      await fetchReminders();
    };

    loadData();
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

  //Language
  const { language } = useLanguage();
  const t = translations[language];

  //DarkMode & LightMode
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

  const [activeNav, setActiveNav] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  //New Activity 30 days
  const recentTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.created_at).getTime();

    const now = new Date().getTime();

    const diffDays = (now - txnDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 30;
  });

  //Reminder
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      name: "Arisan PKK",
      date: "12 Jun",
      nominal: "Rp 200 rb",
    },

    {
      id: 2,
      name: "Cicilan motor",
      date: "15 Jun",
      nominal: "Rp 650 rb",
    },

    {
      id: 3,
      name: "BPJS Kesehatan",
      date: "20 Jun",
      nominal: "Rp 54 rb",
    },
  ]);
  const [newReminder, setNewReminder] = useState({
    name: "",
    date: "",
    nominal: "",
  });

  // Greeting Calculation
  const hour = new Date().getHours();

  let greeting = t.gn;

  if (hour >= 4 && hour < 11) {
    greeting = t.gm;
  } else if (hour >= 11 && hour < 15) {
    greeting = t.ga;
  } else if (hour >= 15 && hour < 18) {
    greeting = t.ge;
  }

  //Total Transactions
  const totalIncome = transactions
    .filter((txn) => txn.type === "in")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const totalExpense = transactions
    .filter((txn) => txn.type === "out")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  //AI Coach
  const [aiDismissed, setAiDismissed] = useState(false);
  const aiCoach = generateAiMessage({
    income: totalIncome,
    expense: totalExpense,
    balance: totalBalance,
    goals,
    reminders,
  });

  // Health Score Calculation
  const expensePercentage =
    totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  const needsExpense = transactions
    .filter((txn) => txn.category === "Food")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const entertainmentExpense = transactions
    .filter((txn) => txn.category === "Entertainment")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const savingPercentage =
    totalIncome > 0 ? Math.round((totalBalance / totalIncome) * 100) : 0;
  const needsPercentage =
    totalIncome > 0 ? Math.round((needsExpense / totalIncome) * 100) : 0;
  const entertainmentPercentage =
    totalIncome > 0
      ? Math.round((entertainmentExpense / totalIncome) * 100)
      : 0;

  let healthScore = 100 - expensePercentage;

  if (healthScore < 0) {
    healthScore = 0;
  }

  let healthStatus = "Not Healthy";
  let healthColor = "#ef4444";
  let healthBadge = "bg-rose-50 text-rose-700";

  if (healthScore >= 75) {
    healthStatus = "Very Healthy";
    healthColor = "#10b981";
    healthBadge = "bg-emerald-50 text-emerald-700";
  } else if (healthScore >= 50) {
    healthStatus = "Healthy";
    healthColor = "#f59e0b";
    healthBadge = "bg-amber-50 text-amber-700";
  } else if (healthScore >= 30) {
    healthStatus = "Need Attention";
    healthColor = "#f97316";
    healthBadge = "bg-orange-50 text-orange-700";
  }

  if (healthScore >= 75) {
    healthStatus = "Very Healthy";
  } else if (healthScore >= 50) {
    healthStatus = "Healthy";
  } else if (healthScore >= 30) {
    healthStatus = "Needs Attention";
  }

  useEffect(() => {
    if ("Notification" in window) {
      if (window.Notification.permission === "default") {
        window.Notification.requestPermission();
      }
    }
  }, []);

  //Bagian Transactions
  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }
    setTransactions(data || []);
  }

  //Bagian Goal
  async function fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }
    setGoals(data || []);
  }

  async function fetchReminders() {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setReminders(data || []);
  }

  if (activeNav === 1) {
    return (
      <>
        <Report />
        <Navbar
          darkMode={darkMode}
          navItems={navItems}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </>
    );
  }

  if (activeNav === 2) {
    return (
      <>
        <AddTransaction />
        <Navbar
          darkMode={darkMode}
          navItems={navItems}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </>
    );
  }

  if (activeNav === 3) {
    return (
      <>
        <Goals goals={goals} />
        <Navbar
          darkMode={darkMode}
          navItems={navItems}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </>
    );
  }

  if (activeNav === 4) {
    return (
      <>
        <Settings />
        <Navbar
          darkMode={darkMode}
          navItems={navItems}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </>
    );
  }

  //Bagian format balance
  function formatRupiah(number) {
    return number.toLocaleString("id-ID");
  }

  //Add New Reminder
  async function handleAddReminder(e) {
    e.preventDefault();
    if (!newReminder.name || !newReminder.nominal || !newReminder.date) {
      showNotification("Semua field wajib diisi!");
      return;
    }
    const { error } = await supabase.from("reminders").insert([
      {
        name: newReminder.name,
        nominal: newReminder.nominal,
        date: newReminder.date,
      },
    ]);

    if (error) {
      console.log(error);
      showNotification("Gagal tambah reminder");
      return;
    }
    const reminder = {
      id: Date.now(),
      ...newReminder,
    };
    setReminders([reminder, ...reminders]);
    setNewReminder({
      name: "",
      nominal: "",
      date: "",
    });
    setShowAddReminder(false);
  }

  //Delete Reminder
  async function handleDeleteReminder(id) {
    const { error } = await supabase.from("reminders").delete().eq("id", id);

    if (error) {
      console.log(error);
      showNotification("Gagal hapus reminder");
      return;
    }

    setReminders(reminders.filter((r) => r.id !== id));
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-stone-950" : "bg-stone-50"
      } flex justify-center`}
    >
      <div
        className={`w-full max-w-md ${
          darkMode ? "bg-stone-950" : "bg-stone-50"
        } flex flex-col min-h-screen relative`}
      >
        {/* Header */}
        <div
          className={`${
            darkMode ? "bg-stone-900" : "bg-white"
          } px-5 pt-12 pb-5 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-orange-400 tracking-wide uppercase font-medium">
                {greeting}
              </p>

              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-stone-800"
                } mt-0.5`}
              >
                {userName}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReminderModal(true)}
                className={`relative w-9 h-9 ${
                  darkMode ? "bg-stone-700" : "bg-amber-100"
                } rounded-xl flex items-center justify-center`}
              >
                <span className="text-lg">
                  <FontAwesomeIcon
                    icon={faBell}
                    className={`${
                      darkMode ? "text-stone-200" : "text-amber-400"
                    }`}
                  />
                </span>

                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
              </button>

              <div
                className={`w-9 h-9 ${
                  darkMode ? "bg-cyan-900" : "bg-cyan-500"
                } rounded-xl flex items-center justify-center text-white text-xs font-bold`}
              >
                {userName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div
            className={`${
              darkMode
                ? "bg-linear-to-br from-cyan-900 to-stone-900"
                : "bg-linear-to-br from-blue-500 to-indigo-600"
            } rounded-2xl p-5 text-white mb-1`}
          >
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">
              {t.totbal}
            </p>

            <p className="text-3xl font-bold tracking-tight mb-4">
              Rp {formatRupiah(totalBalance)}
            </p>

            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-olive-100 text-[10px] uppercase tracking-wide mb-1">
                  {t.expthismonth}
                </p>

                <p className="text-white font-semibold text-sm">
                  - Rp {formatRupiah(totalExpense)}
                </p>
              </div>

              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-olive-100 text-[10px] uppercase tracking-wide mb-1">
                  {t.sav}
                </p>

                <p className="text-emerald-300 font-semibold text-sm">
                  + Rp {formatRupiah(totalIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* AI Coach */}
          {!aiDismissed && (
            <div className="mx-4 mt-4">
              <div
                className={`${
                  darkMode ? "bg-stone-900" : "bg-blue-100"
                } border ${
                  darkMode ? "border-stone-800" : "border-sky-200"
                } rounded-2xl p-4`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 ${
                      darkMode ? "bg-cyan-900" : "bg-blue-600"
                    } rounded-full flex items-center justify-center text-sm shrink-0`}
                  >
                    <FontAwesomeIcon
                      icon={faRobot}
                      className={`${
                        darkMode ? "text-cyan-400" : "text-cyan-300"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold ${
                          darkMode ? "text-stone-50" : "text-blue-700"
                        }`}
                      >
                        {aiCoach.title}
                      </span>

                      <span
                        className={`text-[10px] ${
                          darkMode ? "bg-cyan-900" : "bg-blue-600"
                        } ${
                          darkMode ? "text-stone-100" : "text-blue-100"
                        } px-2 py-0.5 rounded-full font-semibold`}
                      >
                        AI
                      </span>
                    </div>

                    <p
                      className={`text-xs ${
                        darkMode ? "text-stone-100" : "text-blue-700"
                      } leading-relaxed`}
                    >
                      {aiCoach.message}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <Button
                        className={`${
                          darkMode ? "bg-cyan-900" : "bg-blue-600"
                        } text-white`}
                      >
                        Ya, sisihkan
                      </Button>

                      <Button
                        className={`${
                          darkMode ? "bg-stone-400" : "bg-blue-500"
                        } ${darkMode ? "text-white" : "text-blue-600"}`}
                      >
                        Lihat detail
                      </Button>

                      <Button
                        variant="ghost"
                        className={`ml-auto ${
                          darkMode ? "text-cyan-800" : "text-blue-600"
                        }`}
                        onClick={() => setAiDismissed(true)}
                      >
                        Tutup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Score */}
          <div className="mx-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-200" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.healthfin}
              </p>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${healthBadge}`}
              >
                {healthStatus}
              </span>
            </div>

            <div
              className={`${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-2xl p-4 shadow-sm ring-1 ${
                darkMode ? "ring-stone-800" : "ring-stone-100"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                    />

                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke={healthColor}
                      strokeWidth="6"
                      strokeDasharray={`${(healthScore / 100) * 138.2} 138.2`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-lg font-bold ${
                        darkMode ? "text-stone-100" : "text-stone-700"
                      } leading-none`}
                    >
                      {healthScore}
                    </span>

                    <span
                      className={`text-[9px] ${
                        darkMode ? "text-stone-100" : "text-stone-400"
                      }`}
                    >
                      /100
                    </span>
                  </div>
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-stone-100" : "text-stone-700"
                    } mb-1`}
                  >
                    {t.notefin}
                  </p>

                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    } leading-relaxed`}
                  >
                    {t.notefin2} {expensePercentage}% {t.notefin3}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <HealthBar
                  label={t.expense}
                  pct={expensePercentage}
                  color="red"
                />

                <HealthBar
                  label={t.needs}
                  pct={needsPercentage}
                  color="green"
                />

                <HealthBar label={t.savi} pct={savingPercentage} color="blue" />

                <HealthBar
                  label={t.entertain}
                  pct={entertainmentPercentage}
                  color="amber"
                />
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mx-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-200" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.newactivity}
              </p>

              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className={`text-xs text-cyan-300 ${
                  darkMode ? "hover:text-cyan-600" : "hover:text-cyan-500"
                } font-medium`}
              >
                {showAllTransactions ? t.showless : t.showmore}{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div
              className={`${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-2xl px-4 shadow-sm ring-1 ${
                darkMode ? "ring-stone-800" : "ring-stone-100"
              } `}
            >
              {(showAllTransactions
                ? recentTransactions
                : recentTransactions.slice(0, 3)
              ).map((txn) => (
                <TxnRow
                  key={txn.id}
                  txn={txn}
                  onClick={() => setSelectedTxn(txn)}
                />
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mx-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-100" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.goalsfin}
              </p>

              <button
                onClick={() => setShowAllGoals(!showAllGoals)}
                className={`text-xs text-cyan-300 ${
                  darkMode ? "hover:text-cyan-600" : "hover:text-cyan-500"
                } font-medium`}
              >
                {showAllGoals ? t.showless : t.showmore}{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(showAllGoals
                ? goals.filter(
                    (goal) => Number(goal.current) < Number(goal.target)
                  )
                : goals
                    .filter(
                      (goal) => Number(goal.current) < Number(goal.target)
                    )
                    .slice(0, 4)
              ).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="mx-4 mt-4 mb-2">
            <div
              className={`${darkMode ? "bg-stone-900" : "bg-amber-50"} border ${
                darkMode ? "border-stone-800" : "border-amber-100"
              } rounded-2xl p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-green-500"
                  />
                </span>

                <p
                  className={`text-xs font-semibold ${
                    darkMode ? "text-stone-50" : "text-amber-700"
                  }`}
                >
                  {t.reminderup}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {reminders.length > 0 ? (
                  reminders.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            darkMode ? "bg-stone-200" : "bg-amber-400"
                          } shrink-0`}
                        />
                        <span
                          className={`text-xs ${
                            darkMode ? "text-stone-200" : "text-amber-800"
                          }`}
                        >
                          {r.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs ${
                            darkMode ? "text-stone-200" : "text-amber-500"
                          }`}
                        >
                          {r.date}
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            darkMode ? "text-stone-100" : "text-amber-700"
                          }`}
                        >
                          {r.nominal?.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    }`}
                  >
                    {t.notyetrem}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Detail Model */}
        {selectedTxn && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
            <div
              className={`w-full max-w-sm ${
                darkMode ? "bg-stone-900" : "bg-white"
              } rounded-3xl p-5 shadow-2xl animate-fadeIn`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    } uppercase tracking-wide`}
                  >
                    {t.transdetail}
                  </p>

                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-stone-200" : "text-stone-800"
                    } mt-1`}
                  >
                    {selectedTxn.name}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedTxn(null)}
                  className={`w-8 h-8 rounded-full ${
                    darkMode
                      ? "bg-stone-300 hover:bg-stone-400"
                      : "bg-stone-100 hover:bg-stone-200"
                  } flex items-center justify-center text-stone-500`}
                >
                  <FontAwesomeIcon icon={faX} className="text-stone-500" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div
                  className={` ${
                    darkMode ? "bg-stone-800" : "bg-orange-50"
                  } rounded-2xl p-4`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-100" : "text-stone-400"
                    } mb-1`}
                  >
                    {t.category}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-stone-200" : "text-stone-700"
                    }`}
                  >
                    {t[selectedTxn.category]}
                  </p>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-stone-800" : "bg-green-50"
                  } rounded-2xl p-4`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-200" : "text-stone-400"
                    } mb-1`}
                  >
                    {t.amount}
                  </p>

                  <p
                    className={`text-lg font-bold ${
                      selectedTxn.type === "in"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {selectedTxn.type === "in" ? "+" : "-"}
                    {t.rp} {selectedTxn.amount}
                  </p>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-stone-800" : "bg-blue-50"
                  } rounded-2xl p-4`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-200" : "text-stone-400"
                    } mb-1`}
                  >
                    {t.date}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-stone-200" : "text-stone-700"
                    }`}
                  >
                    {selectedTxn.date}
                  </p>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-stone-800" : "bg-indigo-50"
                  } rounded-2xl p-4`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-stone-200" : "text-stone-400"
                    } mb-1`}
                  >
                    {t.note}
                  </p>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-stone-200" : "text-stone-700"
                    } leading-relaxed`}
                  >
                    {selectedTxn.note || t.nonote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reminder Model */}
        {showReminderModal && (
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
                    {t.listact}
                  </p>

                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-stone-200" : "text-stone-800"
                    } mt-1`}
                  >
                    {t.reminder}
                  </h2>
                </div>
                <button
                  onClick={() => setShowReminderModal(false)}
                  className={`w-8 h-8 rounded-full ${
                    darkMode ? "bg-stone-300" : "bg-stone-100"
                  } ${
                    darkMode ? "hover:bg-stone-400" : "hover:bg-stone-200"
                  } flex items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>

              {/* List Reminder */}
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {reminders.map((item) => (
                  <div
                    key={item.id}
                    className={`${
                      darkMode ? "bg-stone-800" : "bg-blue-50"
                    } rounded-2xl p-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            darkMode ? "text-stone-50" : "text-stone-700"
                          }`}
                        >
                          {item.name}
                        </p>

                        <p
                          className={`text-xs ${
                            darkMode ? "text-stone-100" : "text-stone-400"
                          } mt-1`}
                        >
                          {item.date}
                        </p>

                        <p
                          className={`text-sm font-bold ${
                            darkMode ? "text-amber-400" : "text-amber-600"
                          } mt-2`}
                        >
                          {item.nominal}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteReminder(item.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={`${
                            darkMode
                              ? "text-stone-700 hover:text-red-600"
                              : "text-stone-200 hover:text-red-400"
                          } text-sm`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => setShowAddReminder(true)}
                className={`w-full mt-5 ${
                  darkMode
                    ? "bg-linear-to-r from-cyan-900 to-slate-900"
                    : "bg-linear-to-r from-cyan-500 to-blue-600"
                } rounded-2xl py-4 text-white font-semibold`}
              >
                <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />{" "}
                {t.addreminder}
              </button>
            </div>
          </div>
        )}

        {/* Add Reminder Modal */}
        {showAddReminder && (
          <div className="fixed inset-0 bg-black/30 z-60 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide">
                    {t.newreminder}
                  </p>

                  <h2 className="text-xl font-bold text-stone-800 mt-1">
                    {t.addreminder}
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddReminder(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddReminder} className="space-y-4">
                <input
                  type="text"
                  placeholder={t.namereminder}
                  value={newReminder.name}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm outline-none"
                />

                <input
                  type="text"
                  placeholder={t.date}
                  value={newReminder.date}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      date: e.target.value,
                    })
                  }
                  className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm outline-none"
                />

                <input
                  type="text"
                  placeholder={t.nominal}
                  value={newReminder.nominal}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      nominal: e.target.value,
                    })
                  }
                  className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm outline-none"
                />

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl py-4 text-white font-semibold"
                >
                  {t.savereminder}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Navbar */}
        <Navbar
          darkMode={darkMode}
          navItems={navItems}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
      </div>
    </div>
  );
}
