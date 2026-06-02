"use client";

import FadeIn from "@/components/common/fade-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DownloadTable from "@/components/vectyzen/downloads/download-table";
import { useGetDownloadMyHistoryList } from "@/hooks/use-downloads";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { History } from "../../../../../types/download";

const DownloadsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);

  const { data, isLoading } = useGetDownloadMyHistoryList({
    page,
    limit,
    search: debouncedSearch,
  });
  const histories: History[] = data?.history || [];

  return (
    <section>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Download History</h1>
            <p className="text-muted-foreground">
              Access your previously downloaded assets.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-6 item-start lg:items-center justify-between">
              <div>
                <CardTitle>Downloads History</CardTitle>
                <CardDescription>
                  You can re-download these assets at any time.
                </CardDescription>
              </div>

              <div className="relative w-full lg:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  className="pl-8"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <DownloadTable
              isLoading={isLoading}
              histories={histories}
              totalCount={data?.totalCount || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
};

export default DownloadsPage;
