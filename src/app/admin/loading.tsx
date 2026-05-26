export default function AdminLoading() {
  return (
    <div className="space-y-5 animate-pulse p-6">
      <div className="h-8 w-48 bg-slate-100 rounded-lg" />
      <div className="h-10 bg-slate-100 rounded-xl" />
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-50 border-b border-slate-100 last:border-0" />
        ))}
      </div>
    </div>
  );
}
