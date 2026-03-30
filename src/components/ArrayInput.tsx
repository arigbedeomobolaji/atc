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
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(value || []).map((item: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-2"
          >
            {item}
            <button onClick={() => removeItem(i)}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}
