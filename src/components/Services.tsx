import { Film, Camera, Scissors, Video, Clapperboard, Mic } from "lucide-react";

const services = [
  {
    title: "Line Production",
    description:
      "End-to-end shoot planning and on-ground production support, from locations, crew, schedules, permits, and equipment to hiring/casting actors, models, and talent for your project.",
    icon: Clapperboard,
    color: "#a855f7",
  },
  {
    title: "Video Production",
    description:
      "Professional video production for brands, creators, events, podcasts, campaigns, and digital platforms — handled from concept to final shoot.",
    icon: Film,
    color: "#a855f7",
  },
  {
    title: "Photography",
    description:
      "High-quality photography for products, events, interiors, campaigns, corporate profiles, and branded content with a clean, polished visual style.",
    icon: Camera,
    color: "#a855f7",
  },
  {
    title: "Creative Direction",
    description:
      "Visual planning, concept development, moodboarding, styling guidance, and shoot direction to make every project look aligned and impactful.",
    icon: Video,
    color: "#a855f7",
  },
  {
    title: "Studio Production",
    description:
      "Professional in-house studio setup for podcasts, creators, interviews, brand shoots, and social media content with premium lighting and sound.",
    icon: Mic,
    color: "#a855f7",
  },
  {
    title: "Post-Production",
    description:
      "Editing, color correction, sound design, graphics, reels, and final delivery that turn raw footage into sharp, ready-to-use content",
    icon: Scissors,
    color: "#a855f7",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative pt-6 pb-6 sm:pt-10 sm:pb-14 md:py-24 bg-transparent z-10 overflow-hidden">
      <div className="relative z-10 w-full max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
            What we do?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            We bring your vision to life with end-to-end creative solutions
            tailored to your brand.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon
                    size={28}
                    className="text-primary"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-tr-3xl rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
