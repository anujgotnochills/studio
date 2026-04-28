import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Shuffle from "./Shuffle";
import { cn } from "@/lib/utils";

export type CardNavItem = {
  label: string;
  href: string;
};

export interface CardNavProps {
  items: CardNavItem[];
  className?: string;
}

const CardNav: React.FC<CardNavProps> = ({ items, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-[9999] flex justify-center py-4 px-4 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
        className
      )}
    >
      <nav
        className={cn(
          "relative flex items-center justify-between w-full md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto h-14 md:h-16 px-4 md:px-6 transition-all duration-300",
          scrolled
            ? "bg-black/80 backdrop-blur-xl border border-border/50 rounded-full shadow-lg"
            : "bg-transparent"
        )}
      >
        {/* Left: Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/main logo.png"
              alt="Endurance Image Logo"
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-contain group-hover:scale-110 transition-transform"
            />
            <div className="flex flex-col justify-center items-start text-left">
              <Shuffle
                text="ENDURANCE"
                tag="span"
                className="font-black tracking-tight text-[12px] sm:text-[13px] md:text-[15px] text-white leading-[1.1]"
                duration={0.5}
                shuffleTimes={2}
              />
              <Shuffle
                text="IMAGE"
                tag="span"
                className="font-black tracking-tight text-[12px] sm:text-[13px] md:text-[15px] text-white leading-[1.1]"
                duration={0.5}
                shuffleTimes={2}
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Capsule */}
        <div className="hidden md:flex flex-[2] justify-center items-center">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-white/10 shadow-sm">
            {items.map((item, idx) => (
              <React.Fragment key={item.label}>
                {idx > 0 && (
                  <span className="w-1 h-1 rounded-full bg-white/20 mx-1" />
                )}
                <div className="relative group">
                  <Link
                    to={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="px-5 py-2 text-[14px] font-extrabold text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center justify-center cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: CTA & Mobile Toggle */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <a
            href="https://wa.me/919582156943"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-5 md:px-6 h-10 md:h-11 rounded-full bg-primary text-[12px] md:text-[13px] font-black text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Connect
          </a>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-accent/50 text-foreground"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            "fixed inset-x-4 top-20 bg-black/95 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-6 shadow-2xl transition-all duration-300 transform md:hidden",
            isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-accent/20 text-sm font-black tracking-wide text-foreground hover:bg-primary/5 hover:text-primary transition-all"
              >
                {item.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            
            <a
              href="https://wa.me/919582156943"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center h-14 rounded-2xl bg-primary text-sm font-black text-primary-foreground shadow-xl shadow-primary/20"
            >
              Connect
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
