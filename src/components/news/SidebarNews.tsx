import { Border } from "@/app/news/page";
import { convertDate } from "@/utils/covertDate";
import { NewsItemType } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface SidebarNewsProps {
  slug: string;
  news: NewsItemType[];
  layout?: "responsive" | "horizontal";
}

export function SidebarNews({
  slug,
  news,
  layout = "responsive",
}: SidebarNewsProps) {
  const filteredNews = useMemo(() => {
    return news.filter((item) => item.slug !== slug);
  }, [news, slug]);
  const isHorizontal = layout === "horizontal";

  const containerClasses = isHorizontal
    ? "flex gap-5 overflow-x-auto scrollbar-hideauto scrollbar-hide pb-2"
    : "flex gap-5 overflow-x-auto scrollbar-hideauto scrollbar-hide lg:flex-col lg:overflow-x-auto scrollbar-hidevisible pb-2";

  const cardClasses = isHorizontal
    ? "flex flex-col min-w-[320px]"
    : "flex flex-col lg:flex-row min-w-[280px] lg:min-w-0";

  return (
    <div className="col-span-1 lg:col-span-2 max-h-400 overflow-y-auto scrollbar-hideauto">
      <div className="font-heading text-lg">
        {/* HEADER — never scrolls */}
        <div className="flex items-center gap-5 mb-4">
          <Border />
          <span className="whitespace-nowrap">Latest news</span>
          <Border />
        </div>

        {/* SCROLL CONTAINER */}
        <div className={`${containerClasses} mx-10`}>
          {filteredNews.map((newsItem) => (
            <div
              key={newsItem._id}
              className={`${cardClasses}
        gap-2 rounded-lg shadow-md
        hover:-translate-y-1 transition-all
        py-4 px-2`}
            >
              {/* Image */}
              <div
                className={`relative w-full lg:h-40 rounded-md shrink-0 ${
                  isHorizontal ? "w-full" : "lg:w-48"
                }`}
              >
                <Image
                  src={newsItem.coverImage || "/images/default-image.svg"}
                  alt={newsItem.slug}
                  fill
                  className="object-cover rounded-md w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col h-full">
                {/* Meta */}
                <div className="flex justify-between text-sm italic px-2 py-1 shrink-0">
                  <p>ATC Admin</p>
                  <p>{convertDate(newsItem.createdAt)}</p>
                </div>

                {/* Title */}
                <h1 className="text-sm lg:text-lg font-extrabold px-2 line-clamp-2 min-h-[3rem]">
                  {newsItem.title}
                </h1>

                {/* Excerpt */}
                <p className="font-light font-sans text-justify text-gray-400 px-2 line-clamp-3 min-h-[4.5rem]">
                  {newsItem.excerpt.slice(0, 80)}...
                </p>

                {/* Button pinned to bottom */}
                <div
                  className={`flex mt-auto px-2 pt-2 ${
                    isHorizontal ? "justify-start" : "justify-end"
                  }`}
                >
                  <Link
                    href={`/news/${newsItem.slug}`}
                    className={`bg-dark text-white text-sm rounded-md px-2 py-1`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
