import React, { useEffect, useRef, useState } from 'react';
import { Search, MessageCircle, CalendarCheck, UtensilsCrossed } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import GallerySection from '../components/GallerySection';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search size={32} />,
      title: "Browse the menu",
      description: "Explore our authentic Bengali dishes. Choose what you're craving for tomorrow."
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Place your order on WhatsApp",
      description: "Send us a message with your selected items and preferred delivery time."
    },
    {
      icon: <CalendarCheck size={32} />,
      title: " Confirm at least 1 day in advance",
      description: "We need at least 24 hours notice to source fresh ingredients specifically for your meal."
    },
    {
      icon: <UtensilsCrossed size={32} />,
      title: "We cook fresh for you",
      description: "Your food is prepared from scratch, packed hygienically, and delivered to your doorstep."
    }
  ];

  // Scroll-driven animation state
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0–1

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const rect = scroller.getBoundingClientRect();
      const scrollerHeight = scroller.offsetHeight;
      const windowHeight = window.innerHeight;
      // How far through the tall scroller have we scrolled
      const scrolled = -rect.top;
      const scrollable = scrollerHeight - windowHeight;
      const p = Math.min(1, Math.max(0, scrolled / scrollable));
      setProgress(p);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Line fills across 4 steps; each step activates at its threshold
  const linePercent = Math.round(progress * 100);
  const activeStep = Math.min(3, Math.floor(progress * 4));

  return (
    <div className="bg-stone-50">

      {/* ── Sticky scroll section ── */}
      {/* tall div gives scroll room; sticky child stays on screen */}
      <div ref={scrollerRef} style={{ height: '400vh' }} className="relative">
        <div ref={stickyRef} className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

          {/* Header */}
          <div className="text-center mb-6 md:mb-10 xl:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-serif font-bold text-stone-900 mb-2 md:mb-4">Simple. Fresh. Made for You.</h1>
            <p className="text-sm md:text-base xl:text-lg text-stone-500 max-w-xl mx-auto">
              Scroll to see how it works
            </p>
          </div>

          {/* Steps + animated connector */}
          <div className="w-full max-w-5xl relative">

            {/* ── MOBILE: vertical animated line ── */}
            <div className="md:hidden relative px-2">
              {/* track */}
              <div className="absolute left-9 top-7 bottom-7 w-0.5 bg-orange-100 rounded-full" />
              {/* animated fill */}
              <div
                className="absolute left-9 top-7 w-0.5 bg-orange-500 rounded-full origin-top transition-all duration-100"
                style={{ transform: `scaleY(${linePercent / 100})`, height: 'calc(100% - 56px)' }}
              />
              {steps.map((step, index) => {
                const isActive = index <= activeStep;
                return (
                  <div key={index} className={`flex items-start gap-4 mb-8 last:mb-0 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`relative z-10 shrink-0 w-[72px] h-[72px] rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-orange-50 border-orange-400 text-orange-600 shadow-[0_0_0_6px_rgba(234,88,12,0.12)]'
                        : 'bg-white border-orange-100 text-stone-400'
                    }`}>
                      {step.icon}
                      <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white transition-colors duration-300 ${
                        isActive ? 'bg-stone-900 text-white' : 'bg-stone-300 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className={`text-base font-bold font-serif mb-1 transition-colors duration-300 ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed transition-colors duration-300 ${isActive ? 'text-stone-600' : 'text-stone-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DESKTOP: steps with inline connectors ── */}
            <div className="hidden md:flex items-start gap-0">
              {steps.map((step, index) => {
                const isActive = index <= activeStep;
                const connectorActive = index < activeStep;
                return (
                  <React.Fragment key={index}>
                    {/* Step */}
                    <div className={`flex-shrink-0 w-40 xl:w-52 flex flex-col items-center text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-24 h-24 xl:w-32 xl:h-32 rounded-full border-4 flex items-center justify-center mb-6 xl:mb-8 relative transition-all duration-500 ${
                        isActive
                          ? 'bg-orange-50 border-orange-400 text-orange-600 shadow-[0_0_0_6px_rgba(234,88,12,0.12)]'
                          : 'bg-white border-orange-100 text-stone-400'
                      }`}>
                        {step.icon}
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white transition-colors duration-300 ${
                          isActive ? 'bg-stone-900 text-white' : 'bg-stone-300 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <h3 className={`text-lg xl:text-xl font-bold font-serif mb-3 transition-colors duration-300 ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs xl:text-sm leading-relaxed transition-colors duration-300 ${isActive ? 'text-stone-600' : 'text-stone-400'}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Connector between steps */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 mt-12 xl:mt-16 relative h-0.5">
                        <div className="absolute inset-0 bg-orange-100 rounded-full" />
                        <div
                          className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: connectorActive ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

          </div>

          {/* Scroll hint — hidden on mobile, fades out on desktop once scrolling begins */}
          <div className={`hidden sm:flex mt-8 md:mt-12 xl:mt-20 flex-col items-center gap-2 transition-opacity duration-500 ${progress > 0.05 ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-stone-400 text-sm">Scroll down</span>
            <div className="w-5 h-8 rounded-full border-2 border-stone-300 flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-stone-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Rest of page content (unchanged) ── */}
      <div className="bg-stone-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 rounded-3xl border border-stone-200 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Why 1 Day Advance?</h2>
            <p className="text-stone-600 mb-8">
              Unlike restaurants, we don't keep pre-cooked gravies or frozen meat. When you order, we buy fresh vegetables, fish, and meat the next morning. This ensures you get the healthiest, most authentic home-cooked meal possible.
            </p>
            <WhatsAppButton text="Order Now on WhatsApp" />
          </div>
        </div>
      </div>

      <GallerySection />

    </div>
  );
}
