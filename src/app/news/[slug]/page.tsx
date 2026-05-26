import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { connectToDatabase } from "@/lib/db";
import { normalizeImages } from "@/lib/normalizeImages";
import { convertDate } from "@/utils/covertDate";
import { getPaginatedNews } from "@/lib/services/news.services";
import { SidebarNews } from "@/components/news/SidebarNews";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight, Home, Clock, ArrowLeft, Newspaper } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBySlug(slug);
  if (!data) return { title: "Article Not Found | ATC" };
  const description = (data.excerpt || data.content?.replace(/<[^>]+>/g, "").slice(0, 160) || "").trim();
  return {
    title: `${data.title} | Air Training Command`,
    description,
    openGraph: {
      title: data.title,
      description,
      images: data.coverImage ? [{ url: data.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: data.coverImage ? [data.coverImage] : [],
    },
  };
}

async function getBySlug(slug: string) {
  const { db } = await connectToDatabase();
  const news = await db.collection("news").findOne({ slug });
  return news;
}

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBySlug(slug);
  const { news } = await getPaginatedNews({ page: 1, limit: 7 });

  if (!data) {
    return (
      <div className="min-h-screen bg-[hsl(220,64%,8%)] flex items-center justify-center">
        <Navbar />
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Newspaper size={24} className="text-white/30" />
          </div>
          <p className="text-white/50 text-lg font-semibold mb-2">Article not found</p>
          <p className="text-white/30 text-sm mb-6">The article you're looking for may have been moved or deleted.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(data.content || "");

  return (
    <div className="bg-[hsl(220,64%,8%)]">
      <Navbar />

      {/* ── Cover hero ── */}
      <div className="relative h-[60vh] min-h-[440px] overflow-hidden bg-[hsl(220,64%,8%)]">
        {data.coverImage ? (
          <Image
            src={data.coverImage}
            alt={data.title}
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.04]"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[hsl(220,64%,12%)]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "32px 32px" }}
            />
          </>
        )}

        {/* Multi-layer overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,6%)] via-[hsl(220,64%,10%)]/60 to-[hsl(220,64%,8%)]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,64%,6%)]/70 via-transparent to-transparent" />
        {/* Gold glow at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0">
          <div className="max-w-4xl mx-auto px-6">
            <nav className="flex items-center gap-1.5 text-white/40 text-xs">
              <Link href="/" className="flex items-center gap-1 hover:text-white/70 transition-colors">
                <Home size={10} />
                Home
              </Link>
              <ChevronRight size={10} />
              <Link href="/news" className="hover:text-white/70 transition-colors">
                News
              </Link>
              <ChevronRight size={10} />
              <span className="text-white/55 line-clamp-1 max-w-[200px] sm:max-w-xs">
                {data.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/25">
                <Calendar size={10} className="text-[hsl(45,68%,47%)]" />
                <span className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-wider">
                  {convertDate(data.createdAt, false)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/10">
                <Clock size={10} className="text-white/50" />
                <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                  {readTime} min read
                </span>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-wide max-w-3xl">
              {data.title}
            </h1>

            <div className="mt-5 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <div className="bg-[hsl(220,64%,8%)] py-14">
        <div className="max-w-4xl mx-auto px-6">

          {/* Author + share row */}
          <div className="flex items-center justify-between gap-4 mb-10 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-[hsl(220,64%,16%)] text-xs font-black">ATC</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Air Training Command</p>
                <p className="text-white/40 text-xs">Official ATC Media · Kaduna</p>
              </div>
            </div>
            <Link
              href="/news"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-white/50 text-xs font-semibold hover:bg-white/[0.06] hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={13} />
              All Articles
            </Link>
          </div>

          {/* Prose card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Gold top accent */}
            <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(45,68%,47%)] to-[hsl(350,66%,33%)]" />

            <article
              className="
                px-8 py-10 sm:px-12
                prose prose-slate max-w-none
                prose-headings:font-heading prose-headings:font-black prose-headings:text-[hsl(220,64%,16%)] prose-headings:uppercase prose-headings:tracking-wide
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base
                prose-a:text-[hsl(220,64%,35%)] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[hsl(220,64%,16%)] prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-[hsl(45,68%,47%)] prose-blockquote:bg-[hsl(45,68%,47%)]/5 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-600
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-slate-600
                prose-code:bg-slate-100 prose-code:text-[hsl(220,64%,25%)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[hsl(220,64%,12%)] prose-pre:text-slate-200 prose-pre:rounded-2xl prose-pre:shadow-xl
                prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
                prose-figure:my-8 prose-figure:text-center
                prose-hr:border-slate-200
                [&_figcaption]:text-slate-400 [&_figcaption]:text-xs [&_figcaption]:mt-3 [&_figcaption]:italic [&_figcaption]:text-center
              "
              dangerouslySetInnerHTML={{
                __html: normalizeImages(data.content || ""),
              }}
            />

            {/* Bottom of card — date + back */}
            <div className="px-8 sm:px-12 pb-10 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Calendar size={12} />
                <span>Published {convertDate(data.createdAt, false)}</span>
                {data.updatedAt && data.updatedAt !== data.createdAt && (
                  <span className="text-slate-300">· Updated {convertDate(data.updatedAt, false)}</span>
                )}
              </div>
              <Link
                href="/news"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(220,64%,16%)] text-white text-xs font-bold uppercase tracking-wide hover:bg-[hsl(220,64%,22%)] transition-colors"
              >
                <ArrowLeft size={12} />
                Back to All News
              </Link>
            </div>
          </div>

          {/* Share / next action strip */}
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-white font-bold text-sm">Enjoyed this article?</p>
              <p className="text-white/40 text-xs mt-0.5">Read more stories from Air Training Command</p>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors shadow-lg shrink-0"
            >
              More Articles
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>

      {/* ── Related articles ── */}
      <SidebarNews news={news} slug={slug} />

      <Footer />
    </div>
  );
}
