import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  EmailShareButton,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon,
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LineShareButton,
  LineIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
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
  media: string;
  description?: string;
}

export function ShareDialog({
  children,
  url,
  title = "Share Vectolio",
  media = "",
  description = "",
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
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <EmailShareButton url={url} subject={"Next Share"} body="body">
                  <EmailIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Email
                  </span>
                </EmailShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <PinterestShareButton
                  url={url}
                  media={media}
                  description={description}
                >
                  <PinterestIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Pinterest
                  </span>
                </PinterestShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <FacebookShareButton
                  url={url}
                  quote={title}
                  hashtag={"#vectolio"}
                >
                  <FacebookIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Facebook
                  </span>
                </FacebookShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <FacebookMessengerShareButton
                  url={url}
                  appId={""}
                  redirectUri={url}
                >
                  <FacebookMessengerIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Messenger
                  </span>
                </FacebookMessengerShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <RedditShareButton url={url} title={title}>
                  <RedditIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Rediit
                  </span>
                </RedditShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <LineShareButton url={url} title={title}>
                  <LineIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Line
                  </span>
                </LineShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <TelegramShareButton url={url} title={title}>
                  <TelegramIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Telegram
                  </span>
                </TelegramShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <TwitterShareButton
                  url={url}
                  title={title}
                  hashtags={["vectolio"]}
                >
                  <TwitterIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    X
                  </span>
                </TwitterShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <WhatsappShareButton url={url} title={title} separator=":: ">
                  <WhatsappIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Whatsapp
                  </span>
                </WhatsappShareButton>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[72px]">
                <LinkedinShareButton url={url}>
                  <LinkedinIcon className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Linkedin
                  </span>
                </LinkedinShareButton>
              </div>
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
