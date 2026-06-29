import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  }

  //Forgot Password
  async function handleForgotPassword() {
    if (!email) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Link reset password telah dikirim ke email.");
    }
  }

  //Login Google
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
    }
  }
  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        darkMode ? "bg-stone-950" : "bg-stone-50"
      }`}
    >
      <form
        onSubmit={handleLogin}
        className={`${
          darkMode
            ? "bg-stone-950 border border-stone-800"
            : "bg-white border border-stone-200"
        } p-8 rounded-3xl shadow w-80`}
      >
        <span className="text-green-700 text-4xl uppercase font-extrabold font-inter italic">
          Cash
        </span>
        <span className="text-orange-400 text-3xl font-semibold"> in.</span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${
            darkMode
              ? "bg-stone-950 border-stone-800 focus:border-stone-600 text-white placeholder:text-stone-600"
              : "bg-white border-stone-200 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
          } w-full border rounded-xl p-3 mb-4 mt-3 outline-none`}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${
            darkMode
              ? "bg-stone-950 border-stone-800 focus:border-stone-600 text-white placeholder:text-stone-500"
              : "bg-white border-stone-200 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
          } w-full border rounded-xl p-3 mb-3 outline-none`}
        />

        <div className="flex justify-end mb-5">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-cyan-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className={`${
            darkMode
              ? "bg-linear-to-r from-cyan-900 to-slate-900"
              : "bg-linear-to-r from-blue-500 to-indigo-600"
          } w-full text-white rounded-xl py-3`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`w-full mt-4 border ${
            darkMode
              ? "border-stone-800 text-white"
              : "border-stone-200 text-stone-950"
          } rounded-xl py-3 flex items-center justify-center gap-3`}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-5">
          <div
            className={`flex-1 h-px ${
              darkMode ? "bg-stone-200" : "bg-stone-700"
            }`}
          ></div>
          <span
            className={`px-3 ${
              darkMode ? "text-stone-400" : "text-stone-700"
            } text-sm`}
          >
            Or
          </span>
          <div
            className={`flex-1 h-px ${
              darkMode ? "bg-stone-200" : "bg-stone-700"
            }`}
          ></div>
        </div>

        <p
          className={`text-center mt-5 text-sm ${
            darkMode ? "text-stone-300" : "text-stone-700"
          }`}
        >
          Don't have an account?
        </p>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className={`w-full mt-2 border ${
            darkMode
              ? "border-cyan-500 text-cyan-500"
              : "border-cyan-300 text-cyan-600"
          } rounded-xl py-3 font-semibold`}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
