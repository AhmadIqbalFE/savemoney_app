import {
  faArrowTrendUp,
  faArrowTrendDown,
  faWallet,
  faRobot,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TxnRow from "../components/TxnRow";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

export default function Report() {
  //language
  const { language } = useLanguage();
  const t = translations[language];

  //DarkMode
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

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetchTransactions();

    async function fetchTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.log(error);
        return;
      }
      setTransactions(data || []);
    }
  }, []);
  const income = transactions
    .filter((txn) => txn.type === "in")
    .reduce((total, txn) => total + Number(txn.amount), 0);

  const expense = transactions
    .filter((txn) => txn.type === "out")
    .reduce((total, txn) => total + Number(txn.amount), 0);

  const saving = income - expense;
  const savingTarget = 5000000;

  const savingPercent = Math.min(
    Math.round((saving / savingTarget) * 100),
    100
  );

  const chartData = transactions
    .filter((txn) => txn.type === "out")
    .map((txn) => ({
      date: new Date(txn.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      amount: txn.amount,
    }));

  return (
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
          <p className="text-xs text-orange-400 uppercase tracking-wide font-medium">
            {t.monthlyrep}
          </p>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-stone-100" : "text-stone-800"
            } mt-1`}
          >
            Juny 2026
          </h1>
        </div>

        {/* Summary */}
        <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
          {/* Income */}
          <div
            className={`${
              darkMode ? "bg-emerald-500" : "bg-emerald-100"
            } rounded-2xl p-4 shadow-sm ring-1 ${
              darkMode ? "ring-emerald-700" : "ring-emerald-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl ${
                darkMode ? "bg-emerald-200" : "bg-emerald-50"
              } flex items-center justify-center mb-3`}
            >
              <FontAwesomeIcon
                icon={faArrowTrendUp}
                className="text-emerald-500"
              />
            </div>
            <p
              className={`text-xs ${
                darkMode ? "text-white" : "text-olive-700"
              } mb-1`}
            >
              {t.income}
            </p>
            <h2 className="text-lg font-bold text-stone-800">
              {t.rp} {income.toLocaleString("id-ID")}
            </h2>
          </div>

          {/* Expense */}
          <div
            className={`${
              darkMode ? "bg-rose-700" : "bg-rose-50"
            } rounded-2xl p-4 shadow-sm ring-1 ${
              darkMode ? "ring-rose-700" : "ring-rose-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl ${
                darkMode ? "bg-rose-200" : "bg-rose-50"
              } flex items-center justify-center mb-3`}
            >
              <FontAwesomeIcon
                icon={faArrowTrendDown}
                className="text-rose-500"
              />
            </div>
            <p
              className={`text-xs ${
                darkMode ? "text-white" : "text-olive-700"
              } mb-1`}
            >
              {t.expense}
            </p>
            <h2 className="text-lg font-bold text-stone-800">
              {t.rp} {expense.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        {/* Saving Card */}
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
                  {t.remainsav}
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {t.rp} {saving.toLocaleString("id-ID")}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faWallet} className="text-xl" />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-olive-100">{t.savinggoal}</span>

                <span className="text-xs font-semibold">{savingPercent}%</span>
              </div>

              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${savingPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="mx-4 mt-5">
          <div
            className={`${
              darkMode ? "bg-stone-900" : "bg-white"
            } rounded-2xl p-4 shadow-sm ring-1 ${
              darkMode ? "ring-stone-800" : "ring-stone-100"
            }`}
          >
            <div className="mb-4">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-stone-50" : "text-stone-400"
                } uppercase tracking-wide`}
              >
                {t.expgrap}
              </p>

              <h2
                className={`text-lg font-bold ${
                  darkMode ? "text-red-700" : "text-red-400"
                } mt-1`}
              >
                {t.exptrend}
              </h2>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#444" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={darkMode ? "#fefeff" : "#52525b"}
                  />
                  <YAxis stroke={darkMode ? "#fefeff" : "#52525b"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#18181b" : "#ffffff",

                      border: darkMode
                        ? "1px solid #3f3f46"
                        : "1px solid #e5e7eb",

                      borderRadius: "12px",

                      color: darkMode ? "#ffffff" : "#18181b",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={darkMode ? "#22d3ee" : "#c98429"}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insight */}
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
                  className={`${darkMode ? "text-cyan-400" : "text-cyan-300"}`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold ${
                      darkMode ? "text-stone-50" : "text-blue-700"
                    }`}
                  >
                    Insight AI
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
                  Pengeluaran hiburan naik 18% dibanding bulan lalu. Namun
                  tabungan kamu masih stabil dan berada di atas target minimum
                  bulanan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Aktivitas Terbaru
            </p>
            <button className="text-xs text-cyan-300 font-medium">
              Lihat semua{" "}
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </div>

          <div className="bg-white rounded-2xl px-4 shadow-sm ring-1 ring-stone-100">
            {transactions.map((txn) => (
              <TxnRow key={txn.id} txn={txn} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
