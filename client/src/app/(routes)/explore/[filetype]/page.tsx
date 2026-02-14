import FadeIn from "@/components/common/fade-in";
import SectionSeparator from "@/components/common/section-separator";
import Categories from "@/components/explore/file-type/categories";
import Collection from "@/components/explore/file-type/collection";
import Hero from "@/components/explore/file-type/hero";
import Trending from "@/components/explore/file-type/trending";

const ExploreFileTypePage = () => {
  return (
    <>
      <FadeIn>
        <Hero />
        <Trending />
      </FadeIn>
      <FadeIn>
        <SectionSeparator />
        <Categories />
      </FadeIn>
      <FadeIn>
        <SectionSeparator />
        <Collection />
      </FadeIn>
    </>
  );
};

export default ExploreFileTypePage;
