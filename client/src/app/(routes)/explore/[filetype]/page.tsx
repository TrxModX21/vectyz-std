import SectionSeparator from "@/components/common/section-separator";
import Categories from "@/components/explore/file-type/categories";
import Collection from "@/components/explore/file-type/collection";
import Hero from "@/components/explore/file-type/hero";
import Trending from "@/components/explore/file-type/trending";

const ExploreFileTypePage = () => {
  return (
    <>
      <Hero />
      <Trending />
      <SectionSeparator />
      <Categories />
      <SectionSeparator />
      <Collection />
    </>
  );
};

export default ExploreFileTypePage;
