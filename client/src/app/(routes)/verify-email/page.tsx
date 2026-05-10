import { Suspense } from "react";
import VerifyEmailContent from "./_verify-email";

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<>...</>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
