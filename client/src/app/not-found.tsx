import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Compass, Search } from "lucide-react";
import FadeIn from "@/components/common/fade-in";
import Footer from "@/components/common/footer";
import Header from "@/components/landing/header";

export default function NotFound() {
  return (
    <section>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center mt-8">
        <FadeIn className="max-w-2xl w-full flex flex-col items-center">
          <div className="relative mb-12 flex justify-center w-full">
            {/* Decorative background grid/gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-primary/30 to-rose-500/20 blur-[80px] rounded-full -z-10" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[180px] md:text-[240px] tracking-widest text-foreground/5 dark:text-foreground/10 z-0 select-none">
              404
            </div>

            <div className="flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-background/80 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/20 relative z-10 mx-auto transform hover:scale-105 transition-transform duration-500">
              <Compass
                className="w-14 h-14 md:w-16 md:h-16 text-primary"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
            We couldn&apos;t find the page or asset you&apos;re looking for. It
            might have been moved, renamed, or just vanished into the void.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 gap-2 font-semibold text-base shadow-lg shadow-primary/20"
              >
                <Home className="w-5 h-5" /> Back to Home
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 gap-2 font-semibold text-base border-primary/20 hover:bg-primary/5"
              >
                <Search className="w-5 h-5" /> Explore Assets
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
      <Footer />
    </section>
  );
}
