import { ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <section className="relative pt-6 pb-16 md:py-20 bg-background overflow-hidden" id="about">
      <div className="max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-5 md:gap-12 lg:gap-20">
          
          {/* Left: Caricature Image */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />
            
            <div className="relative group perspective-1000">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 sm:border-8 border-background shadow-2xl transition-transform duration-500 hover:scale-105 hover:rotate-3">
                <img 
                  src="/media/owner_photo.png" 
                  alt="Founder Caricature" 
                  className="w-full h-full object-cover object-center bg-zinc-900" 
                  loading="lazy" 
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:bottom-4 md:-right-8 bg-zinc-900 border-2 border-primary text-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-primary/20 transform hover:-translate-y-2 transition-transform duration-300 text-center">
                <p className="font-black text-sm sm:text-base md:text-lg">Jyotishman Sarmah</p>
                <p className="font-bold text-xs sm:text-sm text-primary opacity-90">Founder</p>
                <div className="w-8 h-1 bg-primary mt-1 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 md:mt-10 lg:mt-0">
            <p className="text-primary font-black text-sm sm:text-base tracking-[0.3em] uppercase mb-4 opacity-70">
              Behind the Lens
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 md:mb-6 leading-tight">
              Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Cinematic</span><br/>Experiences
            </h2>
            
            <div className="text-sm md:text-base text-muted-foreground font-medium mb-4 leading-relaxed max-w-2xl space-y-4">
              <p>
                Endurance Image is a Noida-based media production house. With over <strong className="text-primary text-base md:text-lg">7+ years of experience</strong>, we've grown entirely through word-of-mouth by delivering end-to-end clarity, quality, and execution.
              </p>
              <p>
                From branded content and corporate shoots to live event coverage, we act as invested partners rather than typical vendors. We also feature a premium, fully equipped in-house studio in Noida Sector 65 tailored for creators.
              </p>
              <p>
                If the work is right, it speaks for itself. Most clients stay because they know their vision will be handled flawlessly.
              </p>
              <a href="/gallery" className="inline-flex items-center mt-2 text-primary font-bold hover:underline transition-all">
                View the studio here &rarr;
              </a>
            </div>
            
            <div className="mt-4 md:mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/919582156943"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-purple-600 hover:scale-105 transition-all shadow-lg shadow-primary/30 inline-flex items-center justify-center gap-2 w-fit"
              >
                Let's Talk <ArrowRight size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
