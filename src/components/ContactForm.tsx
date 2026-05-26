"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl bg-white/[0.05] border border-white/10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 flex items-center justify-center mb-5">
          <CheckCircle size={28} className="text-[hsl(45,68%,47%)]" />
        </div>
        <h3 className="font-heading font-black text-white uppercase tracking-wide text-lg mb-2">
          Message Sent!
        </h3>
        <p className="text-white/50 text-sm mb-6 max-w-sm">
          Thank you for reaching out. We will get back to you through your email
          as soon as possible.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  const inputClass =
    "w-full bg-white/[0.05] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[hsl(45,68%,47%)]/60 focus:bg-white/[0.08] transition-all duration-200";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            required
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
          Subject
        </label>
        <input
          type="text"
          placeholder="Brief subject of your message"
          required
          className={inputClass}
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          rows={6}
          placeholder="Type your message here..."
          required
          className={`${inputClass} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-white/30 text-xs">
          All fields are required.
        </p>
        <button
          type="submit"
          disabled={loading || !form.name || !form.email || !form.subject || !form.message}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          {loading ? "Sending…" : "Send Message"}
        </button>
      </div>
    </motion.form>
  );
}
