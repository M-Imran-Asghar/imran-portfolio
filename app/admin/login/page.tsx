"use client";
import { useState } from "react";
import axios, { isAxiosError } from "axios";
import api from "@/lib/axios";

export default function AdminLogin() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth", creds);
      window.location.href = "/admin";
    } catch (err) {
      if (isAxiosError(err)) {
        setError((err.response?.data as { error?: string })?.error ?? "Invalid email or password");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-[#111827] rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-white text-2xl font-bold mb-1 text-center">Admin Login</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Portfolio CMS</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="bg-[#1e2a3a] text-white rounded px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            placeholder="Email"
            type="email"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            required
          />
          <input
            className="bg-[#1e2a3a] text-white rounded px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            placeholder="Password"
            type="password"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold py-3 rounded transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
