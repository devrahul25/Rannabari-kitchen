import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import GallerySection from '../components/GallerySection';

export default function Contact() {
  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We're always happy to answer your questions, discuss a custom catering menu, or take your order for tomorrow's meal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="bg-white p-10 rounded-3xl border border-stone-200">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">Phone / WhatsApp</h3>
                  <p className="text-stone-600">+91 7428666405</p>
                  <p className="text-sm text-stone-500 mt-1">Our primary mode of communication</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">Email</h3>
                  <p className="text-stone-600">baboshomekitchen@gmail.com</p>
                  <p className="text-sm text-stone-500 mt-1">For business enquiries only</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">Location</h3>
                  <p className="text-stone-600">N-5, Behind HDFC Bank, Block N, Kalkaji,<br />New Delhi, Delhi 110019</p>
                  <p className="text-sm text-stone-500 mt-1">We deliver across selected areas in the city.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">Order Timings</h3>
                  <p className="text-stone-600">Place orders before 8 PM for next-day delivery.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col justify-center bg-stone-900 text-white p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-serif font-bold mb-6">Ready to order?</h2>
              <p className="text-stone-300 mb-10 text-lg">
                The fastest way to reach us is via WhatsApp. Send us your requirements and we'll confirm your order immediately.
              </p>
              
              <div className="space-y-4">
                <WhatsAppButton 
                  message="Hi, I want to place an order for tomorrow." 
                  text="Order for Tomorrow" 
                  className="w-full justify-center" 
                />
                <WhatsAppButton 
                  message="Hi, I need catering for an event." 
                  text="Enquire about Catering" 
                  className="w-full justify-center" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <GallerySection />
    </div>
  );
}
