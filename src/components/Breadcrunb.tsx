"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbProps = {
  rootLabel?: string;
  rootHref?: string;
  startIndex?: number;
};

export default function Breadcrumb({
  rootLabel = "Home",
  rootHref = "/",
  startIndex = 0,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-md text-gray-600 py-5">
      <Link href={rootHref} className="hover:underline">
        {rootLabel}
      </Link>

      {segments.slice(startIndex).map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1 + startIndex).join("/");

        return (
          <span key={href}>
            {" / "}
            <Link href={href} className="hover:underline capitalize">
              {seg.replace(/-/g, " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
