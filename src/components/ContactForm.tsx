"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeInSection } from "./FadeInSection";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus(data.error || "Something went wrong.");
    }
  };

  return (
    <FadeInSection>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="px-10 lg:px-20 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg outline-dark border-dark p-4 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="border rounded-lg outline-dark border-dark p-4 w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <input
          type="text"
          placeholder="Subject"
          className="border rounded-lg outline-dark border-dark p-4 w-full"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <textarea
          rows={6}
          placeholder="Your Message..."
          className="border rounded-lg  outline-dark border-dark p-4 w-full"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          type="submit"
          disabled={!form.name || !form.email || !form.subject || !form.message}
          className="px-6 py-3 bg-dark text-white rounded-lg hover:bg-primary/80 transition-all"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        {status && <p className="text-sm text-gray-700">{status}</p>}
      </motion.form>
    </FadeInSection>
  );
}
