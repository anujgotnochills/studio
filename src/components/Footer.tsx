

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/enduranceimage16/" },
  { name: "WhatsApp", href: "https://wa.me/919582156943" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "YouTube", href: "https://youtube.com" }
];

const Footer = () => {
  return (
    <footer 
      id="footer" 
      className="relative w-full bg-[#0d0d0d] pt-16 md:pt-20 pb-0 overflow-hidden"
    >
      {/* Subtle Purple Radial Glow */}
      <div 
        className="absolute top-0 left-0 w-full max-w-[800px] h-[800px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top left, rgba(123,47,190,0.12) 0%, transparent 60%)"
        }}
      />

      {/* Main Grid Container — Note generous 80px side padding requested for larger screens */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Contact / Social (~45% implicitly mapped to col-5 via grid mapping) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-2">
                Let’s make your brand look unforgettable.
              </h2>
              <p className="text-[#999999] text-[13px] italic">
                Contact us to discuss your requirements.
              </p>
            </div>

            {/* Social Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full border border-white/20 text-white text-[12px] bg-transparent transition-all duration-300 hover:border-[#a855f7] hover:text-[#a855f7]"
                >
                  {social.name}
                </a>
              ))}
            </div>

            {/* Contact Details Stack */}
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col">
                <span className="text-[#666666] uppercase text-[10px] font-semibold italic tracking-wider mb-1">
                  Our Studio
                </span>
                <span className="text-white text-[15px] md:text-[17px]">
                  A-74, 2nd Floor, Sector- 65, Noida- 201301
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#666666] uppercase text-[10px] font-semibold italic tracking-wider mb-1">
                  Drop Us a Line
                </span>
                <a href="mailto:enduranceimage16@gmail.com" className="text-white text-[15px] md:text-[17px] hover:text-[#a855f7] transition-colors">
                  enduranceimage16@gmail.com
                </a>
              </div>

              <div className="flex flex-col">
                <span className="text-[#666666] uppercase text-[10px] font-semibold italic tracking-wider mb-1">
                  Phone
                </span>
                <a href="tel:+919582156943" className="text-white text-[15px] md:text-[17px] hover:text-[#a855f7] transition-colors">
                  +91 9582156943
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Map Embed */}
          <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-end justify-center py-6">
            <div className="w-full lg:w-[85%] xl:w-[75%] h-[200px] sm:h-[250px] md:h-[300px] rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10">
              {/* Google Maps iFrame */}
              <iframe 
                title="Endurance Image Map Location"
                src="https://maps.google.com/maps?q=Endurance+Image-+End+to+End+Podcast+Production+Studio&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full border-0 outline-none"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                style={{ filter: "grayscale(100%) invert(90%) contrast(85%)" }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="w-full border-t border-[rgba(255,255,255,0.08)] bg-[#0d0d0d]">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-[80px] py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[#555555] text-[12px] text-center md:text-left">
            © {new Date().getFullYear()} Endurance Image. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[#555555] text-[12px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
