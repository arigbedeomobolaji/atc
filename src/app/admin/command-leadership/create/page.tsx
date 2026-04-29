/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLeader() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    rank: "",
    appointment: "",
    appointmentAbbreviation: "",
    bio: "",
    awards: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/command-leadership", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Failed");

    router.push("/admin/command-leadership");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-xl">
      <h1 className="text-xl font-bold">Add Leader</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button className="bg-black text-white px-4 py-2">Create</button>
    </form>
  );
}
