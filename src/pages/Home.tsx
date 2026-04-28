import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Utensils, Star, ArrowRight, Plus, Minus, ShoppingCart, Trash2, X } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { useCart } from '../context/CartContext';
import { useMenuData } from '../context/MenuDataContext';
import type { MenuItem } from '../services/api';

// ── shared animation presets ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = (delayChildren = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delayChildren } },
});

export default function Home() {
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { cart, addToCart, updateQuantity } = useCart();
  const { menuItems, categories, loading } = useMenuData();

  // Body scroll lock + signal FloatingCart to hide when detail is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      document.dispatchEvent(new CustomEvent('itemDetailToggle', { detail: { open: true } }));
    } else {
      document.body.style.overflow = '';
      document.dispatchEvent(new CustomEvent('itemDetailToggle', { detail: { open: false } }));
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  const openDetail = (item: MenuItem) => {
    if (window.innerWidth < 768) setSelectedItem(item);
  };
  const closeDetail = () => setSelectedItem(null);

  // Show Signature-tagged dishes first; fall back to first 6 if none
  const signatureDishes = menuItems.filter(item => item.tags?.includes('Signature'));
  const allDishes = signatureDishes.length > 0 ? signatureDishes : menuItems.slice(0, 6);

  const filteredDishes = allDishes;

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section
        className="relative bg-stone-900 text-white overflow-hidden w-full"
        style={{
          backgroundImage: 'url(https://babos.jaiveeru.site/uploads/gallery/BHK-BG-updated.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient overlay — heavy on left for readability, moderately dark on right */}
        {/* <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(20,13,4,0.93) 0%, rgba(20,13,4,0.87) 45%, rgba(20,13,4,0.70) 100%)' }}
        /> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center gap-5 lg:gap-14">
            {/* Left: content — staggered fade-up */}
            <motion.div
              className="w-full lg:w-1/2 order-2 lg:order-1"
              variants={stagger(0.12)}
              initial="hidden"
              animate="show"
            >
              <motion.span variants={fadeUp} className="hidden md:inline-block py-1 px-3 rounded-full text-stone-900 text-sm font-semibold mb-6" style={{ backgroundColor: '#fcb316' }}>
                Order at least 1 day in advance
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-2xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-2 md:mb-6 text-center md:text-left">
                This is not fast food.<br className="md:hidden" /> It's food worth waiting for!
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base md:text-xl text-stone-300 mb-6 md:mb-10 leading-relaxed text-center md:text-left">
                Experience the Delicacies of Bengal,<br />  Handcrafted by <b>Chef Babo</b>.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <WhatsAppButton text="Order on WhatsApp" />
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-[rgb(252,179,22)] text-[#140d04] px-6 py-3 rounded-lg font-medium hover:bg-[rgb(240,165,10)] transition-colors text-base"
                >
                  View Menu
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: image — entrance fade+scale (motion), then CSS float loop */}
            <motion.div
              className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="hero-float w-full rounded-2xl overflow-hidden relative lg:aspect-square">
                {/* Shimmer skeleton shown while loading */}
                {!heroImgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-600 via-stone-500 to-stone-700 animate-pulse">
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
                  </div>
                )}
                <img
                  src="https://babos.jaiveeru.site/uploads/gallery/main-banner-image.png"
                  alt="Chef Babo cooking"
                  className={`w-full h-auto lg:h-full object-contain transition-all duration-700 ${heroImgLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-110'}`}
                  referrerPolicy="no-referrer"
                  onLoad={() => setHeroImgLoaded(true)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="py-6 md:py-12 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: horizontal trust ticker — CSS transform (GPU, never lags) */}
          <div className="md:hidden overflow-hidden">
            <div className="ticker-track-trust">
              {[
                { Icon: Clock, label: 'Freshly Cooked', desc: 'No storage, no reheating. Your food is cooked just hours before delivery.' },
                { Icon: Utensils, label: 'Authentic Recipes', desc: 'Traditional Bengali recipes passed down through generations.' },
                { Icon: ShieldCheck, label: 'Limited Orders', desc: 'We take limited orders per day to maintain uncompromising quality.' },
                { Icon: Clock, label: 'Freshly Cooked', desc: 'No storage, no reheating. Your food is cooked just hours before delivery.' },
                { Icon: Utensils, label: 'Authentic Recipes', desc: 'Traditional Bengali recipes passed down through generations.' },
                { Icon: ShieldCheck, label: 'Limited Orders', desc: 'We take limited orders per day to maintain uncompromising quality.' },
              ].map((item, i) => (
                <div key={i} className="flex-shrink-0 w-56 flex flex-col items-center p-5 bg-stone-50 rounded-2xl mx-3 text-center">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                    <item.Icon size={28} />
                  </div>
                  <h3 className="text-base font-bold mb-1 font-serif text-stone-800">{item.label}</h3>
                  <p className="text-stone-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="hidden md:grid md:grid-cols-3 gap-8 text-center"
            variants={stagger(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif text-stone-800">Freshly Cooked</h3>
              <p className="text-stone-600">No storage, no reheating. Your food is cooked just hours before delivery.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif text-stone-800">Authentic Recipes</h3>
              <p className="text-stone-600">Traditional Bengali recipes passed down through generations.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif text-stone-800">Limited Orders</h3>
              <p className="text-stone-600">We take limited orders per day to maintain uncompromising quality.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mb-2">Our Signature Delicacies</h2>
            <p className="text-sm md:text-lg text-stone-600 max-w-2xl mx-auto">A glimpse of our most loved dishes, prepared with care and authentic spices.</p>
          </div>
          
          {/* Skeleton loader */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100 animate-pulse">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-3 sm:p-6 space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-full" />
                    <div className="h-3 bg-stone-100 rounded w-2/3" />
                    <div className="flex justify-between mt-3">
                      <div className="h-6 bg-stone-100 rounded w-16" />
                      <div className="h-6 bg-stone-100 rounded w-12" />
                    </div>
                  </div>
                  <div className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="h-9 bg-stone-100 rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <motion.div
            className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 ${loading ? 'hidden' : ''}`}
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {filteredDishes.map((dish, i) => {
              const cartItem = cart.find(item => item.id === dish.id);
              return (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl overflow-hidden border border-stone-100 group flex flex-col">
                  {/* Clickable area (mobile: opens bottom sheet) */}
                  <div className="flex flex-col flex-1 md:cursor-default cursor-pointer" onClick={() => openDetail(dish)}>
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={dish.img} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <img src={dish.dietary === 'Veg' ? 'https://babos.jaiveeru.site/uploads/gallery/Veg.svg' : 'https://babos.jaiveeru.site/uploads/gallery/Non_Veg_.svg'} alt={dish.dietary} title={dish.dietary} className="absolute top-3 left-3 w-6 h-6 drop-shadow" />
                      {dish.tags && dish.tags.length > 0 && (
                        <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                          {dish.tags.map(t => (
                            <span key={t} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-700">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-6 flex flex-col flex-1">
                      <h3 className="text-sm sm:text-xl font-bold font-serif text-stone-800 mb-1 sm:mb-2">{dish.name}</h3>
                      <p className="text-stone-600 text-xs sm:text-sm mb-2 sm:mb-4 flex-1 line-clamp-1 md:line-clamp-none">{dish.description}</p>
                      <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md truncate mr-2">{dish.portion}</span>
                        <span className="text-sm sm:text-lg font-bold text-stone-900 shrink-0">{dish.price}</span>
                      </div>
                    </div>
                  </div>
                  {/* Add to Cart — always interactive */}
                  <div className="px-3 sm:px-6 pb-3 sm:pb-6 mt-auto border-t border-stone-100 pt-3 sm:pt-4">
                    {cartItem ? (
                      <div className="flex items-center justify-between bg-orange-50 rounded-lg p-1 border border-orange-100">
                        <button 
                          onClick={() => updateQuantity(dish.id, cartItem.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md bg-white transition-colors ${
                            cartItem.quantity === 1 ? 'text-red-500 hover:bg-red-50' : 'text-orange-600 hover:bg-orange-100'
                          }`}
                        >
                          {cartItem.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                        </button>
                        <span className="font-bold text-stone-800 w-8 text-center">{cartItem.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(dish.id, cartItem.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart({ id: dish.id, name: dish.name, price: dish.price })}
                        className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-white border-2 border-orange-600 text-orange-600 px-2 sm:px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm sm:text-base"
                      >
                        <ShoppingCart size={16} className="shrink-0" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="text-center">
            <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-[rgb(252,179,22)] text-[#140d04] px-6 py-3 rounded-lg font-medium hover:bg-[rgb(240,165,10)] transition-colors text-base">
              See Full Menu <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl md:text-4xl font-serif font-bold text-stone-900 mb-6 text-center lg:text-left">Simple. Fresh. Made for You.</h2>
              <p className="text-base md:text-lg text-stone-600 mb-6 md:mb-10 text-center lg:text-left">We operate differently from restaurants. Every meal is planned and cooked specifically for the families who order.</p>
              
              <div className="mb-6 md:mb-10">
                {[
                  "Browse our authentic Bengali menu",
                  "Message us your selection on WhatsApp",
                  "Confirm your order 1 day in advance",
                  "Enjoy freshly prepared, home-cooked food"
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-start gap-4 py-4 lg:py-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0 mt-1">
                        {i + 1}
                      </div>
                      <p className="text-stone-800 font-medium text-lg pt-1">{step}</p>
                    </div>
                    {i < 3 && <hr className="border-[#e4d5c1] lg:hidden" />}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="flex justify-center lg:justify-start">
                <WhatsAppButton text="Place Your Order" />
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-orange-100 rounded-3xl transform translate-x-4 translate-y-4 hidden lg:block"></div>
              <img 
                src="https://babos.jaiveeru.site/uploads/gallery/SHORSHE_ILISH.png" 
                alt="Cooking process" 
                className="relative rounded-3xl object-cover w-full aspect-square lg:aspect-auto lg:h-[500px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Catering Highlight */}
        <section className="py-10 md:py-20 lg:py-24 xl:py-16 bg-orange-50 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Hosting a get-together or wedding?</h2>
            <p className="text-base md:text-lg text-stone-700 mb-6 md:mb-10 mx-auto">
              Bring the authentic taste of Bengal to your special occasions. We offer customized catering menus for corporate events, house parties, family functions, and intimate weddings.
            </p>
            <WhatsAppButton 
              message="Hi, I need catering for an event" 
              text="Enquire on WhatsApp" 
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-10 md:py-20 lg:py-24 xl:py-16 bg-orange-900 text-white text-center overflow-hidden flex flex-col justify-center">
          {/* Decorative pattern */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 to-orange-950/90"></div>
          
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4 md:mb-6">Good food takes time. Book your meal today.</h2>
            <p className="text-base md:text-lg text-orange-100 mb-6 md:mb-10">Limited orders accepted daily to ensure the highest quality.</p>
            <WhatsAppButton text="Order on WhatsApp" className="" />
          </div>
        </section>
      </div>

      <section className="py-10 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">Loved by Families</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-stone-500 text-sm font-medium">Google Reviews</span>
              <div className="flex text-yellow-500 gap-0.5">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
              </div>
              <span className="text-stone-700 font-semibold text-sm">4.9</span>
            </div>
            <p className="text-stone-500 text-sm">Rated 4.9 stars by our happy customers</p>
          </div>

          {/* Ticker */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10" style={{background: 'linear-gradient(to right, white, transparent)'}} />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10" style={{background: 'linear-gradient(to left, white, transparent)'}} />
            <div className="overflow-hidden">
              <div className="ticker-track">
                {[
                  { name: "Padmashri Pushpesh Pant", text: "A true celebration of Bengali heritage. The flavors are authentic and deeply nostalgic.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
                  { name: "Priya D.", text: "Ordered for a family get-together. The packaging was neat and the food was still warm. Everyone loved it.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                  { name: "Rahul Verma", text: "Babo's Home Kitchen brings back the lost art of slow, home-cooked Bengali meals.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/33.jpg" },
                  { name: "Riya Sen", text: "The Kosha Mangsho here is exactly how my grandmother used to make it. The flavors are perfectly balanced.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/26.jpg" },
                  { name: "Sourav B.", text: "The 1-day advance notice is totally worth it. You can taste the freshness in every bite.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/71.jpg" },
                  { name: "Amitabh Das", text: "We ordered catering for my daughter's annaprashan. The Chingri Malai Curry was a massive hit!", rating: 5, avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                  { name: "Sneha Mukherjee", text: "Finding authentic Bengali food that doesn't feel commercialized is hard. Babo's Kitchen nails it.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/63.jpg" },
                  { name: "Sandeep Roy", text: "Consistently delicious food. Great packaging, on-time delivery, and always authentic taste.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
                  { name: "Padmashri Pushpesh Pant", text: "A true celebration of Bengali heritage. The flavors are authentic and deeply nostalgic.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
                  { name: "Priya D.", text: "Ordered for a family get-together. The packaging was neat and the food was still warm. Everyone loved it.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                  { name: "Rahul Verma", text: "Babo's Home Kitchen brings back the lost art of slow, home-cooked Bengali meals.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/33.jpg" },
                  { name: "Riya Sen", text: "The Kosha Mangsho here is exactly how my grandmother used to make it. The flavors are perfectly balanced.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/26.jpg" },
                  { name: "Sourav B.", text: "The 1-day advance notice is totally worth it. You can taste the freshness in every bite.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/71.jpg" },
                  { name: "Amitabh Das", text: "We ordered catering for my daughter's annaprashan. The Chingri Malai Curry was a massive hit!", rating: 5, avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                  { name: "Sneha Mukherjee", text: "Finding authentic Bengali food that doesn't feel commercialized is hard. Babo's Kitchen nails it.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/63.jpg" },
                  { name: "Sandeep Roy", text: "Consistently delicious food. Great packaging, on-time delivery, and always authentic taste.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
                ].map((review, i) => (
                  <div key={i} className="flex-shrink-0 w-72 mx-3 bg-stone-50 border border-stone-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: ['#c2410c','#b45309','#57534e','#b91c1c','#0369a1'][review.name.charCodeAt(0) % 5] }}
                      >
                        {review.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 text-sm truncate">{review.name}</p>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, j) => <Star key={j} size={11} className="fill-yellow-500 text-yellow-500" />)}
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 ml-auto flex-shrink-0" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <p className="text-stone-600 text-sm italic leading-relaxed line-clamp-3">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href="https://www.google.com/search?sca_esv=ec7c3bdcf43043be&rlz=1C1UEAD_enIN1103IN1103&sxsrf=ANbL-n6H7sTNUnsxbe1sKvz7C5jXKgRoYw:1775204154718&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWFKEVraJLFPsGQiyKYtxbBt8XbWWHp5BYmem24NNaaag2dH4JoIeLqPoI8gtbcbaTUziwuRdNEAb63YMJ6fCcUVm6ch3YiMpvjSNH4odrsS_RS8Jw%3D%3D&q=Babo%27s+Home+Kitchen+Reviews&sa=X&ved=2ahUKEwjExK7ontGTAxVpUGcHHX1KLbYQ0bkNegQIPRAF&biw=1536&bih=730&dpr=1.25"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              View all reviews
            </a>
            <a
              href="https://www.google.com/search?sca_esv=ec7c3bdcf43043be&sxsrf=ANbL-n43mDkMrXznQYLcDnQKH15dZszlng:1775204388996&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWFKEVraJLFPsGQiyKYtxbBt8XbWWHp5BYmem24NNaaag2dH4JoIeLqPoI8gtbcbaTUziwuRdNEAb63YMJ6fCcUVm6ch3YiMpvjSNH4odrsS_RS8Jw%3D%3D&q=Babo%27s+Home+Kitchen+Reviews&sa=X&ved=2ahUKEwjc4InYn9GTAxUDwzgGHduuEpAQ0bkNegQIQRAF&biw=1698&bih=813&dpr=1.13#lrd=0x390ce7475a89f5ed:0x2d6637ec50166ef7,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Star size={15} fill="currentColor" />
              Write a review
            </a>
          </div>
        </div>
      </section>

        {/* Gallery */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">A Feast for the Eyes</h2>
            <p className="text-lg text-stone-600">Glimpses of our catering spreads</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <div className="ticker-track-gallery">
              {[...Array(2)].flatMap((_, setIdx) =>
                [
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
                ].map((img, i) => (
                  <div key={`${setIdx}-${i}`} className="flex-shrink-0 w-64 h-48 mx-3 rounded-2xl overflow-hidden bg-stone-100" aria-hidden={setIdx > 0}>
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ── Mobile Item Detail Bottom Sheet (md:hidden) ───────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={closeDetail}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-y-auto"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white pt-4 pb-2 flex justify-center z-10 border-b border-stone-100">
              <button
                onClick={closeDetail}
                className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-stone-600" />
              </button>
            </div>
            <div className="w-full aspect-video overflow-hidden">
              <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6 pb-10">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <img
                  src={selectedItem.dietary === 'Veg'
                    ? 'https://babos.jaiveeru.site/uploads/gallery/Veg.svg'
                    : 'https://babos.jaiveeru.site/uploads/gallery/Non_Veg_.svg'}
                  alt={selectedItem.dietary}
                  className="w-5 h-5"
                />
                {selectedItem.tags?.map(t => (
                  <span key={t} className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">{selectedItem.name}</h2>
              <p className="text-stone-600 leading-relaxed mb-5">{selectedItem.description}</p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-md">{selectedItem.portion}</span>
                <span className="text-2xl font-bold text-stone-900">{selectedItem.price}</span>
              </div>
              {(() => {
                const cartItem = cart.find(c => c.id === selectedItem.id);
                return cartItem ? (
                  <div className="flex items-center justify-between bg-orange-50 rounded-xl p-2 border border-orange-100">
                    <button
                      onClick={() => updateQuantity(selectedItem.id, cartItem.quantity - 1)}
                      className={`w-11 h-11 flex items-center justify-center rounded-lg bg-white transition-colors ${
                        cartItem.quantity === 1 ? 'text-red-500 hover:bg-red-50' : 'text-orange-600 hover:bg-orange-100'
                      }`}
                    >
                      {cartItem.quantity === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                    </button>
                    <span className="font-bold text-stone-800 w-10 text-center text-lg">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(selectedItem.id, cartItem.quantity + 1)}
                      className="w-11 h-11 flex items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart({ id: selectedItem.id, name: selectedItem.name, price: selectedItem.price })}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
