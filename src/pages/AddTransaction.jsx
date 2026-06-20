import { useEffect, useState } from "react";
import { faArrowDown, faArrowUp, faWallet, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../db/supabase";
import { categories } from "../data/categories";
import { translations } from "../data/translations";

export default function AddTransaction() {
//Languages
const language =
  localStorage.getItem("language") || "id";

const t = translations[language];

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

  const [type, setType] = useState("out");
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    note: "",
    date: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

 async function handleSubmit(e) {
  e.preventDefault();

  const { error } = await supabase
    .from("transactions")
    .insert([
      {
        name: formData.name,
        amount: Number(formData.amount),
        category: formData.category,
        note: formData.note,
        date: formData.date,
        type: type,
      },
    ]);

  if (error) {
    console.log(error);

    alert("Gagal menyimpan transaksi, harap isi terlebih dahulu");
    return;
  }

  alert("Transaksi berhasil ditambahkan!");

  setFormData({
    name: "",
    amount: "",
    category: "",
    note: "",
    date: "",
  });
}

  return (
    <div className={`min-h-screen ${darkMode ? "bg-stone-950" : "bg-stone-50"} flex justify-center`}>
      <div className="w-full max-w-md pb-24">

        {/* Header */}
        <div className={`${darkMode ? "bg-stone-900" : "bg-white"} px-5 pt-8 pb-5 shadow-sm`}>
          <p className="text-xs text-orange-400 uppercase tracking-wide font-medium">
            {t.adinfo}
          </p>

          <h1 className={`text-2xl font-bold ${darkMode ? "text-stone-100" : "text-stone-800"} mt-1`}>
            {t.adytrans}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mx-4 mt-4">
          <div className={`${darkMode ? "bg-stone-900" : "bg-white"} rounded-2xl p-4 shadow-sm ring-1 ${darkMode ? "ring-stone-800" : "ring-stone-100"}`}>

            {/* Type Transaction */}
            <div className="mb-5">
              <p className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-3`}>
                {t.tytrans}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("out")}
                  className={`rounded-2xl p-4 border transition-all ${
                    type === "out"
                      ? darkMode 
                      ? "bg-rose-700 border-rose-800"
                      : "bg-rose-200 border-rose-400"
                      : darkMode
                      ? "bg-stone-900 border-stone-800"
                      : "bg-white border-stone-200"
                  }`}>

                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl ${darkMode ? "bg-rose-200" : "bg-rose-100"} flex items-center justify-center mb-2`}>
                      <FontAwesomeIcon icon={faArrowDown} className="text-rose-500"/>
                    </div>

                    <p className={`text-sm font-semibold ${darkMode ? "text-stone-100" : "text-stone-700"}`}>
                      {t.expense}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType("in")}
                  className={`rounded-2xl p-4 border transition-all ${
                    type === "in"
                      ? darkMode
                      ? "bg-emerald-700 border-emerald-800"
                      : "bg-emerald-200 border-emerald-400"
                      : darkMode
                      ? "bg-stone-900 border-stone-800"
                      : "bg-white border-stone-200"
                  }`}>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
                      <FontAwesomeIcon icon={faArrowUp} className="text-emerald-500"/>
                    </div>

                    <p className={`text-sm font-semibold ${darkMode ? "text-stone-100" : "text-stone-700"}`}>
                      {t.income}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name Transaction */}
            <div className="mb-4">

              <label className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-2 block`}>
                {t.ntrans}
              </label>

              <input
                type="text"
                name="name"
                placeholder={t.expeb}
                value={formData.name}
                onChange={handleChange}
                className={`w-full ${darkMode ? "bg-stone-900" : "bg-yellow-50"} border ${darkMode ? "border-stone-800 text-white placeholder:text-stone-500" : "border-yellow-200 text-stone-900 placeholder:text-stone-400"} rounded-xl px-4 py-3 text-sm outline-none ${darkMode ? "focus:border-stone-700" : "focus:border-yellow-400"}`}/>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-2 block`}>
                {t.nominal}
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-stone-200" : "text-stone-400"} text-sm`}>
                  {t.rp}
                </span>

                <input
                  type="number"
                  name="amount"
                  placeholder="0"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full ${darkMode ? "bg-stone-900" : "bg-green-50"} border ${darkMode ? "border-stone-800 text-white placeholder:text-stone-300" : "border-green-200 text-stone-900 placeholder:text-stone-400"} rounded-xl pl-10 pr-4 py-3 text-sm outline-none ${darkMode ? "focus:border-stone-700" : "focus:border-green-400"}`}/>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-2 block`}>
                {t.category}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button key={cat.key} type="button" onClick={() =>
                      setFormData({
                        ...formData,
                        category: cat.key,
                      })
                    }className={`rounded-2xl p-3 border transition-all duration-200 hover:scale-105 active:scale-95 ${
                      formData.category === cat.key
                        ? darkMode
                        ? "border-stone-800 ring-2 ring-stone-700 bg-stone-600"
                        : "border-cyan-500 ring-2 ring-cyan-200 bg-cyan-50"
                        : darkMode
                        ? "border-stone-800 bg-stone-900"
                        : "border-stone-200 bg-white"
                        }`}>

                    <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                      <FontAwesomeIcon icon={cat.icon} className={`text-lg ${cat.iconColor}`}/>
                    </div>

                    <p className={`text-xs font-medium ${darkMode ? "text-stone-100" : "text-stone-700"}`}>
                       {t[cat.key]}
                    </p>
                  </button>
                ))}
              </div>          
            </div>

            {/* Date */}
            <div className="relative">
                <label className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-2 block`}>
                    {t.date}
                </label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={`w-full dark:[color-scheme:dark] ${darkMode ? "bg-stone-900" : "bg-blue-50"} border ${darkMode ? "border-stone-800 text-white placeholder:text-stone-300" : "border-blue-200 text-stone-900 placeholder:text-stone-400"} rounded-xl px-4 py-3 text-sm outline-none ${darkMode ? "focus:border-stone-700" : "focus:border-blue-400"} cursor-pointer`}/>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className={`text-xs font-semibold ${darkMode ? "text-stone-200" : "text-stone-400"} uppercase tracking-wide mb-2 block pt-3`}>
                {t.note}
              </label>

              <textarea
                rows="4"
                name="note"
                placeholder={t.adnote}
                value={formData.note}
                onChange={handleChange}
                className={`w-full ${darkMode ? "bg-stone-900 border-stone-800 focus:border-stone-700 text-white placeholder:text-stone-300" : "bg-indigo-50 border-indigo-200 focus:border-indigo-400 text-stone-900 placeholder:text-stone-400"} border rounded-xl px-4 py-3 text-sm outline-none resize-none`}/>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full ${darkMode ? "bg-gradient-to-r from-cyan-900 to-slate-900" : "bg-gradient-to-r from-blue-500 to-indigo-600"} rounded-2xl py-4 text-white font-semibold shadow-lg`}>
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faWallet} />
                  {t.schange}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

