"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setErr(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a365d] to-[#0f2744] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl"
      >
        <h4 className="text-2xl font-bold text-[#1a365d] mb-2">
          NAF Admin Login
        </h4>

        <p className="text-sm text-slate-500 mb-6">
          Secure access to admin panel
        </p>

        <input
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-[#1a365d] hover:bg-[#c9a227] hover:text-[#1a365d] text-white p-3 rounded transition font-semibold">
          Login
        </button>

        {err && <p className="text-red-600 mt-3">{err}</p>}
      </form>
    </div>
  );
}
