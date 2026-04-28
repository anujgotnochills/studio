import { useEffect, useRef } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "Ansh",
    role: "Senior Videographer",
    image: "/media/team/ansh.png",
    quote: "Capturing the emotion behind the moment, perfectly framed."
  },
  {
    id: "member-2",
    name: "Vidhi",
    role: "Creative Strategist",
    image: "/media/team/vidhi.png",
    quote: "Strategy drives the vision. Creativity brings it to life."
  },
  {
    id: "member-3",
    name: "Namit",
    role: "Lead Photographer",
    image: "/media/team/namit.png",
    quote: "Finding the extraordinary in the everyday light."
  },
  {
    id: "member-4",
    name: "Raj",
    role: "Post-Production Specialist",
    image: "/media/team/raj.png",
    quote: "Polishing the story until every single frame shines."
  },
  {
    id: "member-5",
    name: "David Chen",
    role: "Founder & CEO",
    image: "/media/team/ceo.png",
    quote: "I love turning big ideas into clean, fun, and easy to use designs."
  },
];

const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <div 
      className="relative flex flex-col items-center w-[280px] sm:w-[280px] md:w-[260px] lg:w-[280px] xl:w-[320px] h-[380px] sm:h-[420px] lg:h-[500px] xl:h-[550px] shrink-0 group team-anim-card opacity-0 translate-y-12 transition-all duration-[800ms] ease-out will-change-[opacity,transform] rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Character Image */}
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
      />

      {/* Always Visible Name Gradient (Fades out slightly on hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
      <div className="absolute bottom-6 left-0 right-0 text-center transition-all duration-300 group-hover:translate-y-8 group-hover:opacity-0 pointer-events-none">
        <h4 className="text-white font-black text-2xl tracking-wide drop-shadow-md">
          {member.name}
        </h4>
      </div>

      {/* Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-8 text-center" />

      {/* Content inside Glass Component */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-8 group-hover:translate-y-0 text-white">
        <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed font-semibold italic mb-4 md:mb-6">
          "{member.quote}"
        </p>
        <div className="h-[2px] w-12 bg-primary mb-6" />
        <h4 className="font-black text-xl md:text-2xl mb-1 tracking-tight">
          {member.name}
        </h4>
        <p className="text-primary font-bold uppercase tracking-widest text-[12px]">
          {member.role}
        </p>
      </div>

    </div>
  );
};

export default function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const els = entry.target.querySelectorAll('.team-anim-card');
          els.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add("animate-fade-up-active");
            }, index * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[auto] md:min-h-screen bg-[#0d0d0d] py-16 md:py-[100px] flex flex-col items-center overflow-hidden z-10 box-border"
    >
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center">
        
        {/* Header Text Block */}
        <div className="text-center mb-16 shrink-0 relative z-20">
          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-white mb-2 leading-tight relative inline-block">
            Meet the Crew.
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-[4px] rounded-full bg-gradient-to-r from-transparent via-[#a855f7] to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] opacity-60"></div>
          </h2>
          <p className="text-[16px] sm:text-[20px] md:text-[24px] mt-4 text-[#999999] dark:text-[#c084fc] font-medium tracking-wide">
            The people who bring every vision to life.
          </p>
        </div>

        {/* Horizontal Team Layout */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-4 sm:gap-6 md:gap-8 mt-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-fade-up-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
