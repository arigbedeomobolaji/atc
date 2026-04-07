/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function ArrayInput({ label, value, onChange }: any) {
  const [input, setInput] = useState("");

  function addItem() {
    if (!input.trim()) return;
    onChange([...value, input]);
    setInput("");
  }

  function removeItem(index: number) {
    const copy = [...value];
    copy.splice(index, 1);
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {/* Input + Add */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label={label}
          className="flex-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
          placeholder={`Add ${label}`}
        />

        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          Add
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-2">
        {(value || []).map((item: string, i: number) => (
          <span
            key={i}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
          >
            {item}

            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => removeItem(i)}
              className="text-destructive font-bold hover:opacity-70"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
