import React from 'react';

const GALLERY_IMAGES = [
  "https://baboshomekitchen.in/uploads/gallery/Shorshe_Posto_with_Steam_Rice.png",
  "https://baboshomekitchen.in/uploads/gallery/Shukto.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Shorshe_Posto_Bhetki__Boneless_Fish_.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Copy_of_vegetable_chop.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Mochar_ghonto.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Echorer_torkari.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Copy_of_Tomato_Chatni.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Copy_of_Kumro_Checki.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Copy_of_Tomato_Chatni.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Egg__Deem__Posto.jpg",
  "https://baboshomekitchen.in/uploads/gallery/Chingri_Prawn__Cutlet.jpg",
];

export default function GallerySection() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">A Feast for the Eyes</h2>
          <p className="text-lg text-stone-600">Glimpses of our catering spreads</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="ticker-track-gallery">
            {[...Array(2)].flatMap((_, setIdx) =>
              GALLERY_IMAGES.map((img, i) => (
                <div
                  key={`${setIdx}-${i}`}
                  className="flex-shrink-0 w-64 h-48 mx-3 rounded-2xl overflow-hidden bg-stone-100"
                  aria-hidden={setIdx > 0}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
