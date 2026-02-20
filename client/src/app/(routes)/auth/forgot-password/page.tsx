import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VectyzLogo from "@/components/common/vectyz-logo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full md:w-[65%] flex flex-col items-center justify-center p-8 lg:p-12 relative bg-white">
      {/* Mobile Logo */}
      <div className="md:hidden mb-8">
        <VectyzLogo width={160} height={160} />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-gray-500 text-xs font-normal ml-1"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              className="rounded-full h-11 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>

          <Button
            type="submit"
            disabled={false}
            className="w-full h-11 rounded-full bg-[#0047AB] hover:bg-blue-600 text-white font-semibold shadow-md"
          >
            {/* {isPending && <Loader className="animate-spin mr-2" />} */}
            Send Reset Link
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <Button variant="link" className="w-full" asChild>
            <Link href="/auth/sign-in">
              <ArrowLeft className="mr-2 size-4" />
              Back to Login
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
