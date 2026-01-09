"use client";

import { convertDate } from "@/utils/covertDate";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  createdAt: string;
};

const FALLBACK_IMAGE = "/images/default-image.svg";

export function NewsCardGrid({
  item,
  size = "small",
  showContent = false,
}: {
  item: NewsItem;
  size?: "large" | "small";
  showContent?: boolean;
}) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="relative flex h-full min-h-50 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          src={item.coverImage || FALLBACK_IMAGE}
          alt={item.title}
          fill
          priority={true}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <span className="inline-block mb-2 bg-white text-dark hover:text-white  px-3 hover:px-5 py-1 text-xs uppercase tracking-wide">
            News
          </span>

          <h3
            className={`font-semibold leading-snug ${
              size === "large"
                ? "text-xl sm:text-xl lg:text-2xl"
                : "text-md sm:text-base"
            }`}
          >
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="font-opensans font-extrabold text-xs">
              Air Training Command
            </p>
            <p className="text-sm font-extrabold font-mono">
              {convertDate(item.createdAt)}
            </p>
          </div>
          {showContent && (
            <p className="font-light font-sans text-justify text-gray-400">
              {item.excerpt?.slice(0, 100)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function NewsMosaic({ news }: { news: NewsItem[] }) {
  if (!news?.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-6 h-full">
      <div className="flex-1 h-full min-h-50">
        <NewsCardGrid item={news[0]} />
      </div>
      <div className="flex-1 h-full min-h-[600px]">
        {/* Top RIGHT */}
        <div className="h-1/2">{<NewsCardGrid item={news[1]} />}</div>

        {/* TWO BOTTOM RIGHT */}
        <div className="grid grid-cols-2 gap-1 mt-1 h-1/2">
          <div className="h-full">
            {<NewsCardGrid item={news[2]} size="small" />}
          </div>
          <div className="h-full">
            {<NewsCardGrid item={news[3]} size="small" />}
          </div>
        </div>
      </div>
    </div>
  );
}
