import { Suspense } from "react";
import SearchPages from "./_search";

const SearchPage = () => {
  return (
    <Suspense fallback={<>...</>}>
      <SearchPages />
    </Suspense>
  );
};

export default SearchPage;
