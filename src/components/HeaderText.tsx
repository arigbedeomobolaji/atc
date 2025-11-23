export function HeaderText({ title }: { title: string }) {
  return (
    <div className="py-8">
      <h1 className="text-center font-medium text-xl md:text-2xl lg:text-3xl text-primary-900/95">
        {title.toUpperCase()}
      </h1>
      <div className="w-72 shadow-xl shadow-dark border-b-2 border-b-primary-900/95 rounded-full mx-auto pt-3" />
    </div>
  );
}
