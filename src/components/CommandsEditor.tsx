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
    <div className="space-y-4">
      <h3 className="font-semibold text-lg font-heading text-foreground">
        Commanders
      </h3>

      {safeValue.map((c: any, i: number) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-muted/30"
        >
          {/* Name */}
          <div>
            <label
              htmlFor={`name-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              Full Name
            </label>
            <input
              id={`name-${i}`}
              placeholder="Enter full name"
              value={c.name || ""}
              onChange={(e) => updateItem(i, "name", e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Rank */}
          <div>
            <label
              htmlFor={`rank-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              Rank
            </label>
            <input
              id={`rank-${i}`}
              placeholder="e.g Air Vice Marshal"
              value={c.rank || ""}
              onChange={(e) => updateItem(i, "rank", e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Service Number */}
          <div>
            <label
              htmlFor={`service-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              Service Number
            </label>
            <input
              id={`service-${i}`}
              placeholder="Service number"
              value={c.serviceNumber || ""}
              onChange={(e) => updateItem(i, "serviceNumber", e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor={`start-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              Start Date
            </label>
            <input
              id={`start-${i}`}
              type="date"
              value={c.startDate || ""}
              onChange={(e) => updateItem(i, "startDate", e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor={`end-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              End Date
            </label>
            <input
              id={`end-${i}`}
              type="date"
              value={c.endDate || ""}
              onChange={(e) => updateItem(i, "endDate", e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="md:col-span-2 bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            aria-label={`Remove commander ${c.name || i + 1}`}
          >
            Remove Commander
          </button>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addItem}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        + Add Commander
      </button>
    </div>
  );
}
