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
    <div>
      <h3 className="font-semibold">Custom Sections</h3>

      {safeValue.map((section: any, i: number) => (
        <div key={i} className="border p-3 mt-3 rounded">
          <input
            placeholder="Section Title"
            value={section.title}
            onChange={(e) => updateTitle(i, e.target.value)}
            className="w-full mb-2"
          />

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
      ))}

      <button onClick={addSection} className="mt-2 text-blue-600">
        + Add Section
      </button>
    </div>
  );
}
