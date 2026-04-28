import React from 'react';
import { PartyPopper, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import GallerySection from '../components/GallerySection';

export default function Catering() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
            alt="Event Catering" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
            Bengali Catering for Your Special Moments
          </h1>
          <p className="text-lg md:text-xl text-stone-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Bring the authentic taste of Bengal to your events. We cater to intimate gatherings, ensuring every guest feels the warmth of a home-cooked meal.
          </p>
          <WhatsAppButton 
            message="Hi, I need catering for an upcoming event." 
            text="Enquire on WhatsApp" 
          />
        </div>
      </section>

      {/* Occasions & Offerings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
            
            {/* Occasions */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                <PartyPopper className="text-orange-500" size={32} />
                Perfect For
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Corporate Events", desc: "Elevate your office lunches, board meetings, or team celebrations with premium Bengali cuisine." },
                  { title: "House Parties", desc: "Impress your guests with an authentic Bengali spread without the stress of cooking." },
                  { title: "Family Functions", desc: "Anniversaries, birthdays, or pujas—we handle the food so you can enjoy the moment." },
                  { title: "Intimate Weddings", desc: "Traditional menus curated specifically for smaller, more personal wedding celebrations." }
                ].map((occasion, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-stone-100">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">{occasion.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{occasion.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offerings */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                <HeartHandshake className="text-orange-500" size={32} />
                What We Offer
              </h2>
              <div className="bg-white p-8 rounded-3xl border border-stone-200 flex-1">
                <ul className="space-y-6">
                  {[
                    "Custom menu planning tailored to your event",
                    "Fresh preparation on the day of the event",
                    "Authentic taste using traditional recipes",
                    "Hygienic packaging and timely delivery",
                    "Options for both vegetarian and non-vegetarian spreads",
                    "Special attention to dietary requirements"
                  ].map((offering, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />
                      <span className="text-stone-700 text-lg font-medium">{offering}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-stone-100 text-center">
                  <p className="text-stone-500 text-sm mb-4">Minimum order quantity applies for catering services. Please contact us for details.</p>
                  <WhatsAppButton 
                    message="Hi, I'd like to discuss a custom menu for an event." 
                    text="Discuss Your Menu" 
                    className="w-full justify-center" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <GallerySection />
    </div>
  );
}
