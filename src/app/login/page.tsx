// // app/admin/login/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLogin() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const router = useRouter();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       router.push("/admin/dashboard");
//     } else {
//       setError(data.error || "Login failed");
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Username"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//           className="w-full p-3 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="w-full p-3 border rounded"
//         />
//         <button className="w-full bg-blue-600 text-white p-3 rounded">
//           Login
//         </button>
//         {error && <p className="text-red-600">{error}</p>}
//       </form>
//     </div>
//   );
// }

// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="w-full p-3 border rounded mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Login
        </button>
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </form>
    </div>
  );
}
