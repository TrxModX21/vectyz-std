"use client";

import FadeIn from "@/components/common/fade-in";
import Footer from "@/components/common/footer";
import Header from "@/components/explore/file-type/header";
import { useGetStockDetail } from "@/hooks/use-stock";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import StockDetailSkeleton from "@/components/stock-detail/stock-detail-skeleton";
import { FullImageDialog } from "@/components/stock-detail/full-image-dialog";
import StockPreview from "@/components/stock-detail/stock-preview";
import StockPageTitle from "@/components/stock-detail/stock-page-title";
import StockAction from "@/components/stock-detail/stock-action";
import StockSpecs from "@/components/stock-detail/stock-specs";
import RelatedStock from "@/components/stock-detail/related-stock";

const StockClientPage = () => {
  const params = useParams();

  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { data, isLoading } = useGetStockDetail(params.slug as string);
  const stock = data?.stock;

  useEffect(() => {
    if (stock?.id) {
      // Fire and forget view increment
      api.post(`/stocks/${stock.id}/view`).catch((err) => {
        // Silently ignore analytics errors to not disrupt UX
        console.debug("Analytics view increment skipped/failed:", err.response?.data?.message || err.message);
      });
    }
  }, [stock?.id]);

  const previewFile = stock?.files.find((f) => f.purpose === "PREVIEW");

  return (
    <section>
      <Header />
      {isLoading ? (
        <StockDetailSkeleton />
      ) : (
        <FadeIn>
          <div className="relative mx-auto container py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Left Column: Preview */}
              <div className="lg:col-span-2 space-y-6">
                <FadeIn className="space-y-6">
                  <StockPreview stock={stock} setIsZoomOpen={setIsZoomOpen} />

                  <StockPageTitle stock={stock} />
                </FadeIn>

                <FadeIn
                  delay={0.1}
                  className="prose prose-sm max-w-none text-muted-foreground"
                >
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    Description
                  </h3>
                  <p>{stock?.description}</p>
                </FadeIn>
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-6">
                <FadeIn delay={0.3}>
                  <StockAction stock={stock} />
                </FadeIn>

                {/* Tech Specs */}
                <FadeIn delay={0.6}>
                  <StockSpecs stock={stock} />
                </FadeIn>
              </div>
            </div>

            {/* Related Assets */}
            <RelatedStock stock={stock} isLoading={isLoading} />
          </div>
        </FadeIn>
      )}

      <FullImageDialog
        previewUrl={previewFile?.url || "/placeholder.jpg"}
        title={stock?.title || "Stock Title"}
        description={stock?.description || "Stock description"}
        open={isZoomOpen}
        onOpenChange={setIsZoomOpen}
      />
      <Footer />
    </section>
  );
};

export default StockClientPage;
