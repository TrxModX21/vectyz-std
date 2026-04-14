import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ShareDialogProps {
  children: React.ReactNode;
  title?: string;
  url: string;
}

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.427 2.979 7.427 6.953 0 4.156-2.617 7.502-6.259 7.502-1.22 0-2.368-.635-2.76-1.385l-.753 2.868c-.27 1.026-1.002 2.311-1.493 3.096 1.16.335 2.38.513 3.633.513 6.627 0 11.989-5.365 11.989-11.989C24.01 5.367 18.644 0 12.017 0z" />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.25-1.25-1.25zm-2.75 3.437c-1.124 0-2.223.351-2.905.918l.492.68c.55-.427 1.487-.714 2.414-.714.927 0 1.863.287 2.414.714l.491-.68c-.682-.567-1.781-.918-2.905-.918z" />
  </svg>
);

export function ShareDialog({
  children,
  url,
  title = "Share Vectolio",
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-[#25D366] text-white hover:bg-[#25D366]/90",
      action: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "bg-[#1877F2] text-white hover:bg-[#1877F2]/90",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        ),
    },
    {
      name: "X",
      icon: <Twitter className="h-6 w-6" />,
      color:
        "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
          "_blank",
        ),
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon className="h-6 w-6" />,
      color: "bg-[#E60023] text-white hover:bg-[#E60023]/90",
      action: () =>
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        ),
    },
    {
      name: "Reddit",
      icon: <RedditIcon className="h-6 w-6" />,
      color: "bg-[#FF4500] text-white hover:bg-[#FF4500]/90",
      action: () =>
        window.open(
          `https://www.reddit.com/submit?url=${encodeURIComponent(url)}`,
          "_blank",
        ),
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90",
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        ),
    },
    {
      name: "Email",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-gray-500 text-white hover:bg-gray-500/90",
      action: () =>
        window.open(
          `mailto:?subject=Check out this profile&body=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        ),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 overflow-hidden">
          {/* Social Icons Row with Scroll Arrows */}
          <div className="relative group -mx-2">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollByAmount(-200)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/95 hover:bg-muted border shadow-sm rounded-full flex items-center justify-center transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex items-start gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide scroll-smooth"
            >
              {shareOptions.map((option) => (
                <div
                  key={option.name}
                  className="flex flex-col items-center gap-2 min-w-[72px]"
                >
                  <button
                    type="button"
                    onClick={option.action}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 ${option.color}`}
                    aria-label={`Share to ${option.name}`}
                  >
                    {option.icon}
                  </button>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {option.name}
                  </span>
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollByAmount(200)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/95 hover:bg-muted border shadow-sm rounded-full flex items-center justify-center transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Copy Link Section */}
          <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-xl border">
            <Input
              readOnly
              value={url}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              className={`rounded-lg px-6 shrink-0 transition-all ${
                copied ? "bg-green-500 hover:bg-green-600 text-white" : ""
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
