import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get page title from location state or URL
  const pageTitle = (location.state as any)?.title || 'This Page';

  useEffect(() => {
    setIsVisible(true);

    // Countdown timer - set to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/30 pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* Content */}
      <div className={`relative z-10 text-center max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-accent text-foreground transition-all duration-300 hover:scale-105 border border-border"
        >
          <ChevronLeft size={20} />
          <span>Go Back</span>
        </button>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-4 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6">
            is Coming Soon
          </p>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            We're crafting something amazing. Stay tuned for updates from Endurance Image!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12 p-5 sm:p-8 rounded-3xl bg-card border border-border shadow-sm">
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-6 font-bold">
            Launching In
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="w-full bg-secondary rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-2 border border-border">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">
                    {String(item.value).padStart(2, '0')}
                  </p>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wider font-bold">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-8">
          <p className="text-muted-foreground mb-4 font-medium">Get notified when we launch</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all duration-300 hover:scale-105 whitespace-nowrap shadow-lg shadow-primary/20">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
