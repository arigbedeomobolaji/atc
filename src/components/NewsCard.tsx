import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  content: string;
  createdAt: string;
  coverImage?: string;
  excerpt?: string;
  slug: string;
  showContent?: boolean;
}

export function NewsCard({
  title,
  createdAt,
  coverImage,
  excerpt,
  slug,
  showContent = false,
}: NewsCardProps) {
  const dateString = new Date(createdAt).toDateString().split(" ");
  const month = dateString[1];
  const day = dateString[2];
  const year = dateString[3];
  const monthString = month.substring(0, 3);

  return (
    <Link href={`/news/${slug}`} className="w-full">
      <div className="flex justify-center gap-3 w-full">
        {/* News CoverImage */}
        <div className="w-50 h-50">
          <Image
            src={coverImage || "/images/default-image.svg"}
            alt={title}
            fill
            priority
            className="object-cover rounded-md w-full h-full"
          />
        </div>
        {/* News Details title, content (50) */}

        <div className="p-3">
          <p className="text-xs text-right mt-2 font-bold font-mono pb-3">
            {monthString} {day}, {year}
          </p>
          <h1 className="font-opensans text-sm lg:text-lg hover:text-dark/30">
            {title}
          </h1>
          {showContent && (
            <p className="font-light font-sans text-justify text-gray-400">
              {excerpt?.slice(0, 50)}...
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
