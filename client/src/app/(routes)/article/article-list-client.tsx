"use client";

import Header from "@/components/landing/header";
import Footer from "@/components/common/footer";
import FadeIn from "@/components/common/fade-in";
import { Calendar, Image as ImageIcon, ArrowRight, User, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useBlogPosts, useBlogCategories, useBlogSettings } from "@/hooks/use-blog";
import { format } from "date-fns";
import { stripMarkdown } from "@/lib/helpers";

export default function ArticleListClient() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault("all"));

  const { data: postsData, isLoading: isLoadingPosts } = useBlogPosts({
    page,
    limit: 9,
    search,
    category: category === "all" ? undefined : category,
  });

  const { data: categoriesData } = useBlogCategories();
  const { data: settingsData } = useBlogSettings();

  const settings = settingsData?.data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || null);
    setPage(1);
  };

  const handleCategoryChange = (catSlug: string) => {
    setCategory(catSlug);
    setPage(1);
  };

  const categories = categoriesData?.data || [];
  const posts = postsData?.data?.items || [];
  const meta = postsData?.data?.meta;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 pt-28 pb-16 lg:pb-24 border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-32 text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {settings?.defaultSeoTitle || "Our Latest Articles"}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {settings?.defaultSeoDescription || "Insights, tutorials, and inspiration for designers and developers. Stay up to date with the newest trends in the digital space."}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-32">
            
            {/* Filters & Search */}
            <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleCategoryChange("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category === cat.slug 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search articles..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </FadeIn>

            {/* Grid */}
            <FadeIn>
              {isLoadingPosts ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((article) => (
                    <div key={article.id} className="flex flex-col gap-4 group">
                      <Link href={`/article/${article.slug}`} className="block relative w-full aspect-4/3 bg-blue-50 rounded-xl overflow-hidden">
                        {article.category && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 z-10 shadow-sm">
                            {article.category.name}
                          </div>
                        )}
                        {article.coverImage ? (
                          <img 
                            src={article.coverImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                      </Link>

                      <Link href={`/article/${article.slug}`} className="block mt-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          {article.author.image ? (
                            <img src={article.author.image} alt={article.author.name || ""} className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-700">{article.author.name}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <Calendar size={14} className="text-gray-400 shrink-0" />
                        <span>{article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : ""}</span>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {article.excerpt || stripMarkdown(article.content)}
                      </p>

                      <Link 
                        href={`/article/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mt-auto pt-2"
                      >
                        Read more <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  No articles found matching your criteria.
                </div>
              )}
            </FadeIn>

            {/* Pagination / Load More */}
            {meta && meta.totalPages > 1 && (
              <FadeIn className="mt-16 flex justify-center gap-2">
                {Array.from({ length: meta.totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </FadeIn>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
