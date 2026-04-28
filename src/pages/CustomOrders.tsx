import React from 'react';
import { Package, Clock, Utensils, PhoneCall } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import GallerySection from '../components/GallerySection';

export default function CustomOrders() {
  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">Custom Orders</h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Craving something specific? We take custom orders for your favorite Bengali delicacies. 
            Whether it's a special occasion or just a craving, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-100 rounded-3xl transform -translate-x-4 translate-y-4"></div>
            <img 
              src="https://babos.jaiveeru.site/uploads/gallery/SHORSHE_ILISH.png" 
              alt="Custom Bengali Food" 
              className="relative rounded-3xl object-cover w-full h-[500px]"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-stone-900">How to place a custom order</h2>
            
            <div className="space-y-6">
              {[
                { icon: <Utensils className="text-orange-600" size={24} />, title: "Tell us what you want", desc: "Share your specific cravings or dietary requirements with us." },
                { icon: <Clock className="text-orange-600" size={24} />, title: "Give us 48 hours notice", desc: "Custom dishes require special ingredients and preparation time." },
                { icon: <Package className="text-orange-600" size={24} />, title: "Minimum order value", desc: "Custom orders require a minimum value of ₹1500." },
                { icon: <PhoneCall className="text-orange-600" size={24} />, title: "Confirm on WhatsApp", desc: "We'll discuss the details and pricing, then confirm your order." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-1">{item.title}</h3>
                    <p className="text-stone-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6">
              <WhatsAppButton 
                message="Hi, I would like to place a custom order." 
                text="Discuss Custom Order" 
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <GallerySection />
    </div>
  );
}
