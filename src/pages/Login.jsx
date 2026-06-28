import { useEffect, useState } from "react";
import { supabase } from "../db/supabase";

export default function Login() {
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
    }
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
            ? "bg-stone-900 border-stone-800"
            : "bg-white border-stone-900"
        } p-8 rounded-3xl shadow w-80`}
      >
        <span className="text-stone-900 text-4xl uppercase font-extrabold font-inter italic">
          Cash
        </span>
        <span className="text-orange-300 text-3xl font-semibold"> in.</span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4 mt-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl p-3 mb-3"
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

        <button className="w-full bg-cyan-500 text-white rounded-xl py-3">
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 border border-stone-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-stone-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
}
