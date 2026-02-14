import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";

// Inline SVGs for missing Lucide icons (brand specific)
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
)

const Footer = () => {
  const footerData = {
    products: {
      title: "Product",
      links: [
        "Brusheezy",
        "Vecteezy",
        "Videezy",
        "Enterprise",
        "Education",
        "Developer API",
        "AI Reverse Image Search",
        "AI Background Removal",
        "QR Code Generator",
      ],
    },
    getStarted: {
      title: "Get Started",
      links: [
        "Licensing Agreement",
        "DMCA",
        "Affiliate Program",
        "Popular Vector Searches",
        "Popular Photo Searches",
        "Popular Video Searches",
      ],
    },
    company: {
      title: "Company",
      links: [
        "About us",
        "Careers",
        "Search trends",
        "Blog",
        "Events",
        "Magnific",
        "Slidesgo",
        "Help center",
      ],
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0044CC] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Top Logo */}
        <div className="mb-8 pl-0">
          <Link href="/" className="inline-block">
             <div className="flex items-center gap-2">
                 <svg height="30" viewBox="0 0 88 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-white fill-current">
                     <path d="M11.516 0L8.064 12.088L4.62 0H0L5.94 16.5H10.164L16.14 0H11.516ZM26.46 16.764C30.684 16.764 33.72 13.884 33.72 9.876V9.48C33.72 5.568 30.84 2.688 26.616 2.688C22.416 2.688 19.464 5.616 19.464 9.624V10.02C19.464 13.932 22.344 16.764 26.46 16.764ZM26.616 13.62C24.48 13.62 23.088 12.18 23.088 9.948V9.528C23.088 7.344 24.504 5.832 26.46 5.832C28.596 5.832 29.988 7.272 29.988 9.504V9.924C29.988 12.108 28.572 13.62 26.616 13.62ZM52.926 7.336C52.182 7.144 51.534 7.048 50.886 7.048C48.262 7.048 46.51 8.8 46.51 11.584V16.5H42.886V3.024H46.366V6.16C47.302 4.144 49.006 2.808 51.27 2.808C51.654 2.808 52.062 2.856 52.422 2.928L52.926 7.336ZM69.9482 13.62H59.5082C59.6282 14.892 60.7562 15.9 62.1962 15.9C63.2282 15.9 64.0922 15.468 64.6442 14.652L67.6682 15.996C66.5642 17.82 64.6202 19.14 62.1242 19.14C58.3802 19.14 55.7642 16.212 55.7642 12.444V12.036C55.7642 8.196 58.5962 5.244 62.3882 5.244C66.1802 5.244 68.8922 8.004 68.8922 12.108V13.62H69.9482ZM62.3642 8.148C60.8522 8.148 59.7002 9.18 59.5082 10.668H65.2922C65.1722 9.252 64.0442 8.148 62.3642 8.148ZM17.436 12.28L21.492 1.344H17.652L15.396 8.352L13.116 1.344H9.108L13.26 12.352L11.724 16.5H15.684L17.436 12.28ZM39.696 11.608V12.592C39.696 14.896 38.304 16.336 36.192 16.336C34.08 16.336 32.688 14.896 32.688 12.592V3.024H29.064V12.928C29.064 16.96 31.812 19.384 35.808 19.384C39.096 19.384 41.52 17.488 42.48 15.376L42.816 16.5H45.888V3.024H42.264V11.608H39.696ZM82.2599 3.024H77.6759L73.9639 12.28L70.2279 3.024H66.2199L71.8519 16.5L69.8599 21.684H73.7959L82.2599 3.024ZM88.0294 13.62H79.8694V16.5H92.2534V13.62H83.9854L91.8934 5.928V3.024H79.8694V5.904H87.7774L88.0294 13.62Z" />
                 </svg>
             </div>
          </Link>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-12">
          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{footerData.products.title}</h3>
            <ul className="space-y-2">
              {footerData.products.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:text-white/80 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{footerData.getStarted.title}</h3>
             <ul className="space-y-2">
              {footerData.getStarted.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:text-white/80 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
             <h3 className="text-xl font-bold">{footerData.company.title}</h3>
             <ul className="space-y-2">
              {footerData.company.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:text-white/80 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           {/* Get in touch */}
           <div className="space-y-6">
             <h3 className="text-xl font-bold mb-4">Get in touch</h3>
             <div className="grid grid-cols-4 gap-4 max-w-[200px]">
                <Link href="#" className="hover:opacity-80"><Facebook className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><XIcon className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><PinterestIcon className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><Instagram className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><Youtube className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><Linkedin className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><DiscordIcon className="w-6 h-6" /></Link>
                <Link href="#" className="hover:opacity-80"><RedditIcon className="w-6 h-6" /></Link>
             </div>

             <div className="mt-8">
                 <button className="flex items-center justify-between w-full max-w-[150px] px-4 py-2 border border-white/30 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
                     English
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                         <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                 </button>
             </div>
           </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-4 mb-12">
            <Accordion type="single" collapsible className="w-full border-none">
                {/* Product Accordion */}
                <AccordionItem value="item-1" className="border-b border-white/20">
                    <AccordionTrigger className="text-xl font-bold hover:no-underline py-4 text-white">
                        {footerData.products.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-3 pb-4">
                             {footerData.products.links.map((link) => (
                                <li key={link}>
                                <Link
                                    href="#"
                                    className="text-sm font-medium hover:text-white/80 transition-colors pl-1 block"
                                >
                                    {link}
                                </Link>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                 {/* Get Started Accordion */}
                 <AccordionItem value="item-2" className="border-b border-white/20">
                    <AccordionTrigger className="text-xl font-bold hover:no-underline py-4 text-white">
                        {footerData.getStarted.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-3 pb-4">
                             {footerData.getStarted.links.map((link) => (
                                <li key={link}>
                                <Link
                                    href="#"
                                    className="text-sm font-medium hover:text-white/80 transition-colors pl-1 block"
                                >
                                    {link}
                                </Link>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* Company Accordion */}
                <AccordionItem value="item-3" className="border-b border-white/20">
                    <AccordionTrigger className="text-xl font-bold hover:no-underline py-4 text-white">
                        {footerData.company.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-3 pb-4">
                             {footerData.company.links.map((link) => (
                                <li key={link}>
                                <Link
                                    href="#"
                                    className="text-sm font-medium hover:text-white/80 transition-colors pl-1 block"
                                >
                                    {link}
                                </Link>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
             
             {/* Mobile Get in touch */}
             <div className="pt-6 relative flex flex-col items-center">
                 <h3 className="text-base font-bold mb-6">Get in touch</h3>
                  <div className="flex flex-wrap justify-center gap-6 max-w-[80%] mx-auto mb-8">
                    <Link href="#" className="hover:opacity-80"><Facebook className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><XIcon className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><PinterestIcon className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><Instagram className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><Youtube className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><Linkedin className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><DiscordIcon className="w-7 h-7" /></Link>
                    <Link href="#" className="hover:opacity-80"><RedditIcon className="w-7 h-7" /></Link>
                 </div>

                 <div className="w-full flex justify-center pb-8 border-b border-white/10">
                     <button className="flex items-center justify-between min-w-[150px] px-4 py-2 border border-white/30 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
                         English
                         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                             <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                     </button>
                 </div>
             </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between text-xs md:text-sm text-white/70 space-y-4 md:space-y-0 mt-8 mb-8 md:mb-0">
          <p>© {currentYear} Eezy LLC. All rights reserved</p>
          <div className="flex items-center gap-1">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;