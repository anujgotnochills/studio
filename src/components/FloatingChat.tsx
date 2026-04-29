import { Instagram } from "lucide-react";
import { SOCIAL_URLS } from "@/lib/social";

const WhatsAppIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.5 22l6.05-1.62c1.25.67 2.67 1.05 4.15 1.05 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.99l-.28-.15-2.89.77.8-2.86-.18-.29C4.5 14.62 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
    <path d="M16.65 13.08c-.23-.12-1.37-.68-1.58-.75-.21-.07-.36-.11-.51.11-.15.23-.59.75-.72.9-.13.15-.26.17-.49.05-.23-.12-1-.37-1.91-1.18-.71-.63-1.18-1.41-1.32-1.64-.13-.23-.01-.36.1-.48.1-.1.23-.26.35-.39.12-.13.16-.23.24-.38.08-.15.04-.28-.02-.39-.06-.11-.51-1.23-.7-1.68-.18-.43-.37-.37-.51-.38-.13-.01-.28-.01-.42-.01-.15 0-.39.06-.59.28-.2.23-.76.74-.76 1.81 0 1.07.78 2.1.89 2.25.11.15 1.56 2.38 3.77 3.34.53.23.94.36 1.26.46.53.17 1.01.15 1.39.09.42-.06 1.37-.56 1.56-1.1.19-.54.19-1.01.13-1.1-.06-.09-.21-.14-.44-.26z" />
  </svg>
);

export default function FloatingChat() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
      className="flex flex-col gap-3 sm:gap-4"
    >
      <a
        href={SOCIAL_URLS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 transition-transform duration-300 hover:scale-110 sm:h-14 sm:w-14 group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
        <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-green-500/40 animate-pulse group-hover:scale-125 transition-transform duration-300" />
        <div className="absolute inset-0 -z-10 rounded-full bg-green-500/20 animate-ping opacity-40" />
      </a>

      <a
        href={SOCIAL_URLS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl shadow-[#E1306C]/30 transition-transform duration-300 hover:scale-110 group sm:h-14 sm:w-14"
        style={{
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          zIndex: 10000,
        }}
        title="Follow us on Instagram"
        aria-label="Follow us on Instagram"
      >
        <Instagram size={20} className="relative z-10 text-white sm:h-6 sm:w-6" />
        <div className="absolute inset-0 rounded-full bg-[#E1306C]/20 opacity-0 transition-opacity group-hover:animate-ping" />
      </a>
    </div>
  );
}
