/* eslint-disable @typescript-eslint/no-explicit-any */
const sections = ["about", "responsibilities", "history"];

export function StickyNav({ active }: any) {
  return (
    <div className="sticky top-0 bg-white z-50 shadow px-6 py-3 flex gap-6">
      {sections.map((s) => (
        <a
          key={s}
          href={`#${s}`}
          className={active === s ? "text-[#0B3D91] font-bold" : ""}
        >
          {s}
        </a>
      ))}
    </div>
  );
}
