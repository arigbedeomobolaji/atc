/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CommandersEditor({ value = [], onChange }: any) {
  const safeValue = Array.isArray(value) ? value : [];

  function updateItem(index: number, key: string, val: string) {
    const updated = [...safeValue];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  }

  function addItem() {
    onChange([
      ...safeValue,
      {
        name: "",
        rank: "",
        serviceNumber: "",
        startDate: "",
        endDate: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(safeValue.filter((_: any, i: number) => i !== index));
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Commanders</h3>

      {safeValue.map((c: any, i: number) => (
        <div key={i} className="grid grid-cols-2 gap-2 mt-2">
          <input
            placeholder="Name"
            value={c.name || ""}
            onChange={(e) => updateItem(i, "name", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Rank"
            value={c.rank || ""}
            onChange={(e) => updateItem(i, "rank", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Service Number"
            value={c.serviceNumber || ""}
            onChange={(e) => updateItem(i, "serviceNumber", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={c.startDate || ""}
            onChange={(e) => updateItem(i, "startDate", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={c.endDate || ""}
            onChange={(e) => updateItem(i, "endDate", e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="button"
            onClick={() => removeItem(i)}
            className="col-span-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        + Add Commander
      </button>
    </div>
  );
}
