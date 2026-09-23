"use client";

import { Calendar, Image as ImageIcon, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts, useBlogSettings } from "../../hooks/use-blog";
import { format } from "date-fns";
import { stripMarkdown } from "@/lib/helpers";

const LatestArticeSection = () => {
  const { data: blogPostsResponse, isLoading, isError } = useBlogPosts({ limit: 6 });
  const { data: blogSettingsResponse } = useBlogSettings();
  const settings = blogSettingsResponse?.data;

  return (
    <div className="container mx-auto px-4 lg:px-32 py-12 lg:py-20">
      {/* Header Block */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700">
          {settings?.defaultSeoTitle || "Latest on the Blog"}
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
          {settings?.defaultSeoDescription || "Stay up to date with our most recent insights, tutorials, and inspiration for your next big project."}
        </p>
      </div>

      {/* Grid Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading && (
          // Skeleton Loader
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-4/3 bg-gray-200 rounded-xl" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mt-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-16 bg-gray-200 rounded w-full" />
            </div>
          ))
        )}

        {isError && (
          <div className="col-span-full text-center text-gray-500 py-8">
            Failed to load latest articles. Please try again later.
          </div>
        )}

        {!isLoading && !isError && blogPostsResponse?.data.items.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No articles published yet. Check back later!
          </div>
        )}

        {!isLoading && !isError && blogPostsResponse?.data.items.map((article) => (
          <div key={article.id} className="flex flex-col gap-4 group">
            {/* Image Placeholder */}
            <Link href={`/article/${article.slug}`} className="block">
              <div className="w-full aspect-4/3 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden relative">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
            </Link>

            {/* Headline Link */}
            <Link href={`/article/${article.slug}`} className="block mt-2">
              <h3 className="text-xl font-bold text-blue-700 group-hover:text-blue-500 transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>

            {/* Author Row */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                {article.author.image ? (
                  <Image src={article.author.image} alt={article.author.name} fill sizes="24px" className="object-cover" />
                ) : (
                  <User size={14} className="text-gray-400" />
                )}
              </div>
              <span className="font-medium text-gray-700">{article.author.name}</span>
              <span className="mx-1 text-gray-300">•</span>
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span>{article.publishedAt ? format(new Date(article.publishedAt), "MMM dd, yyyy") : "Unknown Date"}</span>
            </div>

            {/* Excerpt */}
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
              {article.excerpt || stripMarkdown(article.content).substring(0, 150) + "..."}
            </p>


            {/* Read More Link */}
            <Link 
              href={`/article/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-lime-500 hover:text-lime-600 transition-colors mt-auto pt-2"
            >
              Read more <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {(!isLoading && !isError && blogPostsResponse?.data?.meta?.totalItems && blogPostsResponse.data.meta.totalItems > 6) ? (
        <div className="mt-16 flex justify-center">
          <Link 
            href="/article" 
            className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 px-8 py-3 text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            View all articles
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default LatestArticeSection;

