import Footer from "@/components/common/footer";
import Header from "@/components/explore/file-type/header";
import { ReactNode, Suspense } from "react";

const ExploreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <Suspense fallback={<div className="h-16 w-full bg-background border-b" />}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </section>
  );
};

export default ExploreLayout;
