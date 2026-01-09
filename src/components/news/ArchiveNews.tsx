/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from "../NewsCard";
import { NewsGridWithContent } from "./NewsGridWithContent";
// import { NewsCardGrid } from "./NewsMosaic";

export default function ArchiveNews({ news }: { news: any[] }) {
  return (
    <div className="flex flex-row overflow-x-auto scrollbar-hideauto scrollbar-hide max-h-400 lg:flex-col lg:overflow-y-auto scrollbar-hideauto gap-3">
      {news.map((item) => (
        <NewsCard key={item._id} {...item} />
      ))}
    </div>
  );
}
