import React, { useState, useEffect } from 'react';
import { Info, Search, Filter, Plus, Minus, ShoppingCart, Trash2, X } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import GallerySection from '../components/GallerySection';
import { useCart } from '../context/CartContext';
import { useMenuData } from '../context/MenuDataContext';

export default function Menu() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<import('../services/api').MenuItem | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg'>('All');
  const [menuMode, setMenuMode] = useState<'ALL' | 'TIFFIN'>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });
  const [isDaySelected, setIsDaySelected] = useState(false);
  const { cart, addToCart, updateQuantity } = useCart();
  const { menuItems, categories, loading, error } = useMenuData();

  const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const selectedDayIndex = DAYS_ORDER.indexOf(selectedDay);
  const isPastDay = selectedDayIndex < todayIndex;
  const isToday = selectedDayIndex === todayIndex;

  // Body scroll lock + signal FloatingCart to hide
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

  const openDetail = (item: import('../services/api').MenuItem) => {
    if (window.innerWidth < 768) setSelectedItem(item);
  };

  const closeDetail = () => setSelectedItem(null);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setActiveCategories([]);
      return;
    }
    
    setActiveCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredItems = menuItems.filter(item => {
    // Mode specific filtering
    if (menuMode === 'TIFFIN') {
      if (!item.isTiffin) return false;
      if (!item.availableDays?.includes(selectedDay)) return false;
    } else {
      if (item.isTiffin) return false;
    }

    const matchesCategory = activeCategories.length === 0 || activeCategories.some(c => {
      const lowerC = c.toLowerCase();
      return item.category.toLowerCase() === lowerC ||
             item.tags?.some(t => t.toLowerCase() === lowerC);
    });
    const matchesDietary = dietaryFilter === 'All' || item.dietary === dietaryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  const availableCategories = categories.filter(c => {
    if (c === 'Veg' || c === 'Non Veg') return false;
    // For Tiffin mode, only show categories that have tiffin items
    // For All mode, only show categories that have non-tiffin items
    return menuItems.some(item => 
      item.category === c && 
      (menuMode === 'TIFFIN' ? item.isTiffin : !item.isTiffin)
    );
  });

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen">
        {/* Same breadcrumb hero */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            height: '200px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-stone-900/60" />
          <div className="relative text-center">
            <p className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-2">Babo's Home Kitchen</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Our Menu</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-50 min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load menu</p>
          <p className="text-stone-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb / Hero */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: '200px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative text-center">
          <p className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-2">Babo's Home Kitchen</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Our Menu</h1>
          {menuMode === 'TIFFIN' && isDaySelected && (
            <button 
              onClick={() => setIsDaySelected(false)}
              className="mt-4 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-xs font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <span>{selectedDay} Menu</span>
              <Filter size={14} />
              <span className="opacity-70">(Change Day)</span>
            </button>
          )}
        </div>
      </div>

      {menuMode === 'TIFFIN' && !isDaySelected ? (
        <div className="bg-stone-50 min-h-[60vh] flex items-center justify-center py-16 px-4">
          {/* ... day selector code ... */}
          <div className="max-w-4xl w-full text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">What day are you planning for?</h2>
            <p className="text-stone-600 mb-10 max-w-lg mx-auto">Our tiffin service menu changes daily. Select a day to view our special offerings.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {DAYS_ORDER.map((day, idx) => {
                const isPast = idx < todayIndex;
                const isDayToday = idx === todayIndex;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDaySelected(true);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      isDayToday 
                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200' 
                        : 'border-white bg-white hover:border-orange-200'
                    } ${isPast ? 'opacity-60 grayscale-[0.5]' : ''} group shadow-sm`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDayToday ? 'text-orange-600' : 'text-stone-400'}`}>
                      {isDayToday ? 'Today' : idx === todayIndex + 1 ? 'Tomorrow' : 'Day'}
                    </span>
                    <span className="text-lg font-bold text-stone-800">{day}</span>
                    {isPast && <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Viewing Only</span>}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setMenuMode('ALL')}
              className="mt-12 text-stone-500 hover:text-stone-800 font-medium underline underline-offset-4 decoration-stone-300"
            >
              Back to regular menu
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-stone-50 min-h-screen py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Menu Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-1">
                <button
                  onClick={() => { setMenuMode('ALL'); setIsDaySelected(false); }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    menuMode === 'ALL' 
                      ? 'bg-stone-900 text-white shadow-md' 
                      : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  All Menu
                </button>
                <button
                  onClick={() => setMenuMode('TIFFIN')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    menuMode === 'TIFFIN' 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  Tiffin Service
                </button>
              </div>
            </div>
            
            {menuMode === 'TIFFIN' && isPastDay && (
              <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-800 font-semibold text-sm">You are viewing a past menu ({selectedDay}).</p>
                  <p className="text-amber-700 text-xs mt-0.5">Ordering is disabled for this day. Please select today or a future date to place an order.</p>
                </div>
              </div>
            )}

          {/* Mobile: search button + filter icon row + dietary toggle */}
          <div className="md:hidden space-y-3 mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setShowMobileSearch(true)}
              className="flex-1 flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-full text-stone-400"
            >
              <Search size={18} />
              <span className="text-sm">{searchQuery || 'Search dishes…'}</span>
            </button>
            <button
              onClick={() => setShowMobileFilter(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-sm font-medium transition-colors ${
                activeCategories.length > 0
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white border-stone-200 text-stone-600'
              }`}
            >
              <Filter size={18} />
              {activeCategories.length > 0 && (
                <span className="w-5 h-5 bg-orange-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeCategories.length}
                </span>
              )}
            </button>
          </div>
          {/* Dietary toggle — mobile */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-stone-100 rounded-full p-1">
              {(['All', 'Veg'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDietaryFilter(opt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    dietaryFilter === opt
                      ? opt === 'Veg' ? 'bg-white shadow-sm text-green-700'
                        : 'bg-white shadow-sm text-stone-800'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {opt === 'Veg' && <span className="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0" />}
                  {opt}
                </button>
              ))}
            </div>
          </div>
          </div>

          {/* Desktop: Header & Search */}
          <div className="hidden md:flex items-center justify-center gap-4 max-w-3xl mx-auto mb-10">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search for dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-full leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
            {/* Dietary toggle — desktop */}
            <div className="inline-flex items-center bg-stone-100 rounded-full p-1 shrink-0">
              {(['All', 'Veg'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDietaryFilter(opt)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    dietaryFilter === opt
                      ? opt === 'Veg' ? 'bg-white shadow-sm text-green-700'
                        : 'bg-white shadow-sm text-stone-800'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {opt === 'Veg' && <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Categories (desktop only) */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mb-12">
          {availableCategories.map(category => {
            const isActive = activeCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-stone-400 text-base font-medium">No dishes match your current filters.</p>
              <button
                onClick={() => { setActiveCategories([]); setDietaryFilter('All'); setSearchQuery(''); }}
                className="mt-3 text-sm text-orange-600 underline underline-offset-2"
              >
                Clear all filters
              </button>
            </div>
          ) : filteredItems.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 group flex flex-col hover:border-orange-200 transition-colors">
                {/* Clickable area (mobile: opens bottom sheet) */}
                <div className="flex flex-col flex-1 md:cursor-default cursor-pointer" onClick={() => openDetail(item)}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    {/* Veg / Non-Veg indicator */}
                    <img src={item.dietary === 'Veg' ? 'https://babos.jaiveeru.site/uploads/gallery/Veg.svg' : 'https://babos.jaiveeru.site/uploads/gallery/Non_Veg_.svg'} alt={item.dietary} title={item.dietary} className="absolute top-3 left-3 w-6 h-6 drop-shadow" />
                    {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                        {item.tags.map(t => (
                          <span key={t} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-700">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-xl font-bold font-serif text-stone-800 mb-1 sm:mb-2">{item.name}</h3>
                    <p className="text-stone-600 text-xs sm:text-sm mb-2 sm:mb-4 flex-1 line-clamp-1 md:line-clamp-none">{item.description}</p>
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md truncate mr-2">
                        {item.portion}
                      </span>
                      <span className="text-sm sm:text-lg font-bold text-stone-900 shrink-0">{item.price}</span>
                    </div>
                  </div>
                </div>
                {/* Add to Cart — always interactive, not part of clickable area */}
                <div className="px-3 sm:px-6 pb-3 sm:pb-6 mt-auto border-t border-stone-100 pt-3 sm:pt-4">
                  {cartItem ? (
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-1 border border-orange-100">
                      <button
                        onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-white transition-colors ${
                          cartItem.quantity === 1
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-orange-600 hover:bg-orange-100'
                        }`}
                      >
                        {cartItem.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                      </button>
                      <span className="font-bold text-stone-800 w-8 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => !isPastDay && addToCart({ id: item.id, name: item.name, price: item.price })}
                      disabled={isPastDay}
                      className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        isPastDay 
                          ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {isPastDay ? (
                        <>Ordering Closed</>
                      ) : (
                        <>
                          <ShoppingCart size={16} className="shrink-0" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center bg-orange-50 p-10 rounded-3xl border border-orange-100 max-w-3xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Ready to order?</h3>
          <p className="text-lg text-stone-600 mb-8">Send us your selected items on WhatsApp. Remember, we need 1 day advance notice!</p>
          <WhatsAppButton 
            message="Hi, I'd like to place an order from the menu for tomorrow." 
            text="Order on WhatsApp with selected items" 
            className="w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          />
        </div>

        </div>
      </div>
    )}

    <GallerySection />

      {/* ── Mobile Item Detail Bottom Sheet (md:hidden) ───────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={closeDetail}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-y-auto"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button pinned at top center */}
            <div className="sticky top-0 bg-white pt-4 pb-2 flex justify-center z-10 border-b border-stone-100">
              <button
                onClick={closeDetail}
                className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-stone-600" />
              </button>
            </div>

            {/* Image */}
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content */}
            <div className="p-6 pb-10">
              {/* Dietary + tags */}
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

              {/* Add to Cart */}
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
                    onClick={() => !isPastDay && addToCart({ id: selectedItem.id, name: selectedItem.name, price: selectedItem.price })}
                    disabled={isPastDay}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-colors ${
                      isPastDay
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {isPastDay ? 'Ordering Closed' : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Search Overlay ── */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[60] md:hidden bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 shrink-0">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="text-stone-500 hover:text-stone-800 p-1"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
            <input
              autoFocus
              type="text"
              placeholder="Search dishes, ingredients…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2 text-base outline-none text-stone-900 placeholder-stone-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600 p-1">
                <X size={18} />
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {searchQuery.trim() === '' ? (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                <Search size={40} className="mb-3 opacity-30" />
                <p className="text-sm">Type to search dishes…</p>
              </div>
            ) : (
              menuItems
                .filter(item =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 12)
                .map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-4 px-4 py-3 border-b border-stone-50 active:bg-stone-50 text-left"
                    onClick={() => setShowMobileSearch(false)}
                  >
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 text-sm">{item.name}</p>
                      <p className="text-xs text-stone-400 line-clamp-1">{item.description}</p>
                      <p className="text-xs font-medium text-orange-600 mt-0.5">{item.price}</p>
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Filter Bottom Sheet ── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setShowMobileFilter(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-stone-900 text-xl font-serif">Filter by Category</h3>
              <div className="flex items-center gap-2">
                {activeCategories.length > 0 && (
                  <button
                    onClick={() => { setActiveCategories([]); setShowMobileFilter(false); }}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center"
                >
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => {
                const isActive = activeCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => { toggleCategory(category); setShowMobileFilter(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
