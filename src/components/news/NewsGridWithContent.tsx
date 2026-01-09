"use client";

import { convertDate } from "@/utils/covertDate";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  createdAt: string;
};

const FALLBACK_IMAGE = "/images/default-image.svg";

export function NewsGridWithContent({
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
      className="relative flex items-center hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative flex-1 w-1/2 h-75 overflow-hidden items-center">
        <Image
          src={item.coverImage || FALLBACK_IMAGE}
          alt={item.title}
          fill
          priority={true}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-black/40 to-transparent" />

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

          {showContent && (
            <p className="font-light font-sans text-justify text-gray-400">
              {item.excerpt.slice(0, 100)}...
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 w-1/2 p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <p className="font-opensans font-extrabold text-xs">
              Air Training Command
            </p>
            <p className="text-sm font-extrabold font-mono">
              {convertDate(item.createdAt)}
            </p>
          </div>

          <p className="font-light font-sans text-justify text-gray-500 leading-10 mt-3">
            {item.excerpt}...
          </p>
        </div>

        <button className="bg-dark text-white px-2 py-3 text-sm mt-4 cursor-pointer rounded-md">
          Read more
        </button>
      </div>
    </Link>
  );
}
