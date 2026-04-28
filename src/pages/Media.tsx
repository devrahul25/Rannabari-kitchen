import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface GalleryImage {
  url: string;
  title: string;
}

// Media coverage images - Add your press coverage, events, features, and media appearances
const GALLERY_IMAGES: GalleryImage[] = [
  {
    url: 'https://baboshomekitchen.in/uploads/gallery/WhatsApp_Image_2023-05-01_at_00.15.07.jpeg',
    title: 'Media Feature 2023'
  },
  
  {
    url: 'https://baboshomekitchen.in/uploads/gallery/WhatsApp_Image_2023-05-01_at_00.12.43.jpeg',
    title: 'Press Coverage'
  },
  {
    url: 'https://baboshomekitchen.in/uploads/gallery/WhatsApp_Image_2023-04-13_at_16.03.04__1_.jpeg',
    title: 'Event Participation'
  },
 
  {
    url: 'https://baboshomekitchen.in/uploads/gallery/224293424_189165499897313_4853292214230007604_n.jpg',
    title: 'Media Highlight'
  }
];

export default function Media() {
  const [images] = useState<GalleryImage[]>(GALLERY_IMAGES);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goToPrev = () => setLightboxIndex((prev: number | null) => (prev !== null && prev > 0 ? prev - 1 : prev));
  const goToNext = () => setLightboxIndex((prev: number | null) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-orange-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            Media Coverage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-stone-600 max-w-2xl mx-auto"
          >
            Explore our journey through press features, event highlights, and media appearances.
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <Images size={64} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No media coverage yet</p>
              <p className="text-sm mt-2">Check back soon for our press features and event highlights!</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {images.map((img: GalleryImage, idx: number) => (
                <motion.div
                  key={img.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => openLightbox(idx)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 aspect-square bg-stone-100"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 text-white text-sm font-medium z-10">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Navigation Buttons */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} className="text-white" />
              </button>
            )}
            {lightboxIndex < images.length - 1 && (
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={28} className="text-white" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].title}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              referrerPolicy="no-referrer"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />

            {/* Image Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-3 rounded-full text-white text-sm font-medium backdrop-blur-sm"
            >
              {images[lightboxIndex].title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}