import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dark Mode
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

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password tidak sama.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Akun berhasil dibuat. Silakan cek email.");

    navigate("/");
  }

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        darkMode ? "bg-stone-950" : "bg-stone-50"
      }`}
    >
      <form
        onSubmit={handleRegister}
        className={`${
          darkMode
            ? "bg-stone-950 border border-stone-800"
            : "bg-white border border-stone-200"
        } p-8 rounded-3xl shadow w-80`}
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <span className="text-green-700 text-4xl uppercase font-extrabold italic">
            Cash
          </span>

          <span className="text-orange-400 text-3xl font-semibold"> in.</span>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-stone-400" : "text-stone-600"
            }`}
          >
            Create your account
          </p>
        </div>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-4 outline-none ${
            darkMode
              ? "bg-stone-950 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600"
              : "bg-white border-stone-200 text-stone-900 focus:border-stone-600"
          }`}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-4 outline-none ${
            darkMode
              ? "bg-stone-950 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600"
              : "bg-white border-stone-200 text-stone-900 focus:border-stone-600"
          }`}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-4 outline-none ${
            darkMode
              ? "bg-stone-950 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600"
              : "bg-white border-stone-200 text-stone-900 focus:border-stone-600"
          }`}
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-6 outline-none ${
            darkMode
              ? "bg-stone-950 border-stone-800 text-white placeholder:text-stone-500 focus:border-stone-600"
              : "bg-white border-stone-200 text-stone-900 focus:border-stone-600"
          }`}
        />

        {/* Register Button */}
        <button
          type="submit"
          className={`w-full rounded-xl py-3 text-white ${
            darkMode
              ? "bg-linear-to-r from-cyan-900 to-slate-900"
              : "bg-linear-to-r from-blue-500 to-indigo-600"
          }`}
        >
          Create Account
        </button>

        {/* Back Login */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`w-full mt-4 border rounded-xl py-3 font-semibold ${
            darkMode
              ? "border-cyan-500 text-cyan-500"
              : "border-cyan-300 text-cyan-600"
          }`}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
