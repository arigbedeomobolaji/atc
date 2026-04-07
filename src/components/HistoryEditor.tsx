/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HistoryEditor({
  value = [],
  onChange = () => {},
}: any) {
  const safeValue = Array.isArray(value) ? value : [];

  function updateItem(index: number, key: string, val: string) {
    const updated = [...safeValue];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  }

  function addItem(e: any) {
    onChange([...safeValue, { date: "", event: "" }]);
  }

  function removeItem(index: number) {
    onChange(safeValue.filter((_: any, i: number) => i !== index));
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">History</h3>

      <div className="flex gap-2 mt-2">
        <input
          disabled={true}
          placeholder="Date"
          className="border p-2 rounded w-1/3"
        />

        <input
          disabled={true}
          placeholder="Title"
          className="border p-2 rounded w-1/3"
        />

        <input
          disabled={true}
          placeholder="Event"
          className="border p-2 rounded flex-1"
        />
      </div>

      {safeValue.map((h: any, i: number) => (
        <div key={i} className="flex gap-2 mt-2">
          <input
            placeholder="Date"
            type="date"
            value={h.date || ""}
            onChange={(e) => updateItem(i, "date", e.target.value)}
            className="border p-2 rounded w-1/3"
          />

          <input
            placeholder="Title"
            value={h.title || ""}
            onChange={(e) => updateItem(i, "title", e.target.value)}
            className="border p-2 rounded w-1/3"
          />

          <input
            placeholder="Event"
            value={h.event || ""}
            onChange={(e) => updateItem(i, "event", e.target.value)}
            className="border p-2 rounded flex-1"
          />

          <button
            type="button"
            onClick={() => removeItem(i)}
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        + Add History
      </button>
    </div>
  );
}
