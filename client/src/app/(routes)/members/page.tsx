import { Suspense } from "react";
import MembersPages from "./_members";

const MemberPage = () => {
  return (
    <Suspense fallback={<>...</>}>
      <MembersPages />
    </Suspense>
  );
};

export default MemberPage;
