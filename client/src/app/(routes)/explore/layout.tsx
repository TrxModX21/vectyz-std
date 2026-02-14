import Footer from "@/components/common/footer";
import Header from "@/components/explore/file-type/header";
import { ReactNode } from "react";

const ExploreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <Header />
      {children}
      <Footer />
    </section>
  );
};

export default ExploreLayout;
