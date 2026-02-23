import { Suspense } from "react";
import ResetPasswordForm from "./_reset-password-form";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<>...</>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
