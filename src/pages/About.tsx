import React from 'react';
import { Heart, Leaf, ShieldCheck } from 'lucide-react';
import GallerySection from '../components/GallerySection';

export default function About() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
            
            {/* Image fills grid cell driven by text column height */}
            <div className="relative overflow-hidden rounded-3xl min-h-[400px]">
              <div className="absolute inset-0 bg-orange-100 rounded-3xl transform -translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src="https://babos.jaiveeru.site/uploads/gallery/contact.jpg.jpeg" 
                alt="Babo cooking" 
                className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8">Delicacies of Bengal</h1>
              
              <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
                <p>
                  Babo’s Home Kitchen is not fast food; it is food worth waiting for. Bringing you the true Delicacies of Bengal, every dish is handcrafted by Chef Babo using time-honoured family recipes, with no precooking and no shortcuts. What began as a deeply personal journey by Dipayan Mazumdar, an obsessive foodie and storyteller, has grown into a boutique home kitchen rooted in love, memory, and cultural pride. Inspired by cooking for his daughter, friends, and family, Babo recreates the delicate balance of spices and the richness of slow-cooked Bengali meals with uncompromising authenticity.
                </p>
                <p>
                  Today, from its base in Delhi NCR, Babo’s Home Kitchen serves those who seek more than just food. Whether it is corporate gatherings, house parties, family functions, intimate weddings, or custom cravings, every order is prepared fresh with care and intention. This is not just a meal, but a soulful experience of Bengal, delivered with warmth and meaning.
                </p>
                
                <p className="font-medium text-stone-900 italic border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                  "A humble home kitchen approach that blends traditional panch phoron techniques with a modern focus on wholesome, soulful flavors."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">The principles that guide every meal we prepare</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck size={40} className="text-orange-600" />,
                title: "Curated Experience",
                desc: "Our menu features exquisite and unique Bengali delicacies designed to offer a deep sense of culinary nostalgia."
              },
              {
                icon: <Leaf size={40} className="text-orange-600" />,
                title: "Locally Sourced",
                desc: "Babo undertakes extensive research to source the freshest ingredients and is very particular about procuring produce locally."
              },
              {
                icon: <Heart size={40} className="text-orange-600" />,
                title: "Balancing Tradition",
                desc: "We strictly follow age-old recipes to maintain the original taste and flavor while integrating creative touches."
              }
            ].map((value, i) => (
              <div key={i} className="text-center p-8 bg-stone-50 rounded-3xl border border-stone-100">
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold font-serif text-stone-900 mb-4">{value.title}</h3>
                <p className="text-stone-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GallerySection />
    </div>
  );
}
