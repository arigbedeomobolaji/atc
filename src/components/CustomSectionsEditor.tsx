/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrayInput from "./ArrayInput";

export default function CustomSectionsEditor({ value, onChange }: any) {
  const safeValue = Array.isArray(value) ? value : [];

  function addSection() {
    onChange([...value, { title: "", items: [] }]);
  }

  function updateTitle(i: number, val: string) {
    const copy = [...value];
    copy[i].title = val;
    onChange(copy);
  }

  function addItem(i: number, item: string) {
    const copy = [...value];
    copy[i].items.push(item);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg font-heading text-foreground">
        Custom Sections
      </h3>

      {safeValue.map((section: any, i: number) => (
        <div
          key={i}
          className="border border-border bg-muted/30 rounded-xl p-4 space-y-4"
        >
          {/* Section Title */}
          <div>
            <label
              htmlFor={`section-title-${i}`}
              className="block text-sm font-medium text-muted-foreground"
            >
              Section Title
            </label>
            <input
              id={`section-title-${i}`}
              placeholder="Enter section title"
              value={section.title}
              onChange={(e) => updateTitle(i, e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Items */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Items
            </p>

            <ArrayInput
              label="Items"
              value={section.items}
              onChange={(items: any) => {
                const copy = [...value];
                copy[i].items = items;
                onChange(copy);
              }}
            />
          </div>
        </div>
      ))}

      {/* Add Section */}
      <button
        type="button"
        onClick={addSection}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        + Add Section
      </button>
    </div>
  );
}
