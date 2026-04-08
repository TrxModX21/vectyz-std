"use client";

import FadeIn from "@/components/common/fade-in";
import Header from "@/components/explore/file-type/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberCard from "@/components/vectyzen/member-card";
import { useInfiniteGetAllVectyzen } from "@/hooks/use-vectyzen";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MembersPages = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== debouncedSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      router.replace(`/members?${params.toString()}`);
    }
  }, [debouncedSearch, router, searchParams]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteGetAllVectyzen({
      search: debouncedSearch,
      limit: 12,
    });

  const vectyzen: Vectyzen[] =
    data?.pages.flatMap((page: any) => page.users) || [];

  return (
    <section>
      <Header />

      <div className="container mx-auto py-12 px-4 md:px-8 max-w-screen-2xl">
        <FadeIn className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover talented creators, connect with fellow designers, and find
            inspiration from top professionals.
          </p>
        </FadeIn>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members, tags..."
              className="pl-9 h-11 bg-muted/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vectyzen.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {vectyzen.map((member, index) => (
              <FadeIn key={`${member.id}-${index}`} delay={(index % 12) * 0.08}>
                <MemberCard member={member} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-muted-foreground">
              No members found
            </h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
            <Button
              variant="link"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center pt-12 pb-4">
            <Button
              variant="outline"
              className="rounded-full px-8"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersPages;
