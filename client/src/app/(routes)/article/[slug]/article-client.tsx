"use client";

import { useParams } from "next/navigation";
import { useBlogPostDetail, useBlogPosts } from "@/hooks/use-blog";
import Header from "@/components/landing/header";
import Footer from "@/components/common/footer";
import FadeIn from "@/components/common/fade-in";
import { format } from "date-fns";
import {
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Clock,
  Share2,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { stripMarkdown } from "@/lib/helpers";

// Estimate reading time from content
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleClientPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: postResponse, isLoading, isError } = useBlogPostDetail(slug);
  const post = postResponse?.data;

  // Fetch related posts from same category
  const { data: relatedResponse } = useBlogPosts({
    limit: 3,
    category: post?.category?.slug,
  });
  const relatedPosts =
    relatedResponse?.data?.items?.filter((p) => p.slug !== slug)?.slice(0, 3) ||
    [];

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex justify-center items-center py-40">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center py-40 gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Article Not Found
          </h1>
          <p className="text-gray-500 max-w-md text-center">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/article"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Articles
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const readingTime = estimateReadingTime(post.content || "");

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1">
        {/* ───── Full-Width Cover Image Hero ───── */}
        <section className="relative pt-20">
          {/* Back navigation (above image) */}
          <div className="container mx-auto px-4 lg:px-32 py-4">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} /> Back to Articles
            </Link>
          </div>

          {/* Cover Image */}
          {post.coverImage ? (
            <div className="container mx-auto px-4 lg:px-16">
              <FadeIn delay={0.2}>
                <div className="w-full aspect-21/9 rounded-2xl overflow-hidden bg-gray-100 relative">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Subtle gradient overlay at the bottom */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </FadeIn>
            </div>
          ) : (
            <div className="container mx-auto px-4 lg:px-16">
              <div className="w-full aspect-21/9 rounded-2xl overflow-hidden bg-linear-to-br from-blue-50 via-blue-100 to-indigo-50 flex items-center justify-center">
                <ImageIcon className="w-20 h-20 text-blue-200" />
              </div>
            </div>
          )}
        </section>

        {/* ───── Article Header (Title + Meta) ───── */}
        <section className="container mx-auto px-4 lg:px-32 mt-10 lg:mt-14">
          <FadeIn delay={0.3}>
            <div className="max-w-3xl mx-auto text-center">
              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/article?category=${post.category.slug}`}
                  className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 hover:bg-blue-700 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt / Subtitle */}
              {post.excerpt && (
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 pb-8 border-b border-gray-100">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white shadow-sm relative">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name || ""}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-700">
                    {post.author.name}
                  </span>
                </div>

                <span className="text-gray-300 hidden sm:block">•</span>

                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-gray-400 shrink-0" />
                  <span>
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                      : ""}
                  </span>
                </div>

                <span className="text-gray-300 hidden sm:block">•</span>

                {/* Reading Time */}
                <div className="flex items-center gap-1.5">
                  <Clock size={15} className="text-gray-400 shrink-0" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ───── Article Body ───── */}
        <section className="container mx-auto px-4 lg:px-32 py-12 lg:py-16">
          <FadeIn delay={0.4}>
            <article className="prose prose-lg prose-blue max-w-3xl mx-auto prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ""}
              </ReactMarkdown>
            </article>
          </FadeIn>
        </section>

        {/* ───── Tags + Share Row ───── */}
        {((post.tags && post.tags.length > 0) || true) && (
          <section className="container mx-auto px-4 lg:px-32">
            <div className="max-w-3xl mx-auto py-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-gray-400 mr-1" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-default"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Share button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Share2 size={16} />
                Share this article
              </button>
            </div>
          </section>
        )}

        {/* ───── Author Card ───── */}
        <section className="container mx-auto px-4 lg:px-32 pb-12">
          <FadeIn>
            <div className="max-w-3xl mx-auto bg-linear-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-white shadow-md relative">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || ""}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <User size={28} className="text-gray-400" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Written by
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-lg">
                    Content creator and contributor at Vectolio. Passionate about
                    digital design, development, and creative resources.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ───── Related Articles ───── */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-100 py-16 lg:py-20">
            <div className="container mx-auto px-4 lg:px-32">
              <FadeIn>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Related Articles
                  </h2>
                  <Link
                    href={`/article${post.category ? `?category=${post.category.slug}` : ""}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View all <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group flex flex-col gap-4"
                    >
                      <div className="w-full aspect-4/3 bg-blue-50 rounded-xl overflow-hidden relative">
                        {article.category && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 z-10 shadow-sm">
                            {article.category.name}
                          </div>
                        )}
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} className="text-gray-400 shrink-0" />
                        <span>
                          {article.publishedAt
                            ? format(
                                new Date(article.publishedAt),
                                "MMM d, yyyy",
                              )
                            : ""}
                        </span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span>
                          {estimateReadingTime(article.content || "")} min read
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {article.excerpt ||
                          stripMarkdown(article.content).substring(0, 120) +
                            "..."}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="mt-10 text-center sm:hidden">
                  <Link
                    href={`/article${post.category ? `?category=${post.category.slug}` : ""}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View all articles <ArrowRight size={16} />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
