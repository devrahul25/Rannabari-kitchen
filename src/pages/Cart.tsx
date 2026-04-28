import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, MapPin, Info, Clock, User, Phone, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import WhatsAppButton from '../components/WhatsAppButton';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';
import { api } from '../services/api';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalItems } = useCart();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    mobile: '',
    date: '',
    time: '',
    address: '',
    deliveryType: 'delivery'
  });
  
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [formError, setFormError] = useState('');
  const [showSameDayModal, setShowSameDayModal] = useState(false);
  const [showNextDayModal, setShowNextDayModal] = useState(false);

  // Calculate today's date string in local timezone
  const getTodayStr = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today.getTime() - offset);
    return localToday.toISOString().split('T')[0];
  };
  const todayStr = getTodayStr();

  const getTomorrowStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const offset = tomorrow.getTimezoneOffset() * 60000;
    const localTomorrow = new Date(tomorrow.getTime() - offset);
    return localTomorrow.toISOString().split('T')[0];
  };
  const tomorrowStr = getTomorrowStr();

  const isPast8PM = new Date().getHours() >= 20;

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
      return total + (price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      if (value === todayStr) {
        setShowSameDayModal(true);
      } else if (value === tomorrowStr && isPast8PM) {
        setShowNextDayModal(true);
      }
    }
    
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser');
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomerInfo(prev => ({
          ...prev,
          address: `https://maps.google.com/?q=${latitude},${longitude}`
        }));
        setIsFetchingLocation(false);
        if (formError) setFormError('');
      },
      (error) => {
        setFormError('Unable to retrieve your location. Please enter address manually.');
        setIsFetchingLocation(false);
      }
    );
  };

  const generateWhatsAppMessage = () => {
    let message = `Hi Babo's Home Kitchen! I'd like to place an order:\n\n`;
    
    message += `*Customer Details:*\n`;
    message += `Name: ${customerInfo.name}\n`;
    message += `Mobile: ${customerInfo.mobile}\n`;
    message += `Type: ${customerInfo.deliveryType === 'delivery' ? 'Delivery' : 'Takeaway'}\n`;
    message += `Date: ${customerInfo.date}\n`;
    message += `Time: ${customerInfo.time}\n`;
    if (customerInfo.deliveryType === 'delivery') {
      message += `Address: ${customerInfo.address}\n`;
    }
    message += `\n*Order Details:*\n`;
    
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} (${item.price})\n`;
    });
    message += `\n*Subtotal: ₹${calculateTotal()}*`;
    return message;
  };

  const generateSameDayInquiry = () => {
    let message = `Hi Babo, I would like to request a *SAME-DAY EXCEPTION* for today.\n\n`;
    message += `*My Cart:*\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
    });
    message += `\nIs it possible to prepare this for today?`;
    return message;
  };

  const generateNextDayInquiry = () => {
    let message = `Hi Babo, I missed the 8 PM cutoff for tomorrow's delivery. Is it still possible to place an order for tomorrow?\n\n`;
    message += `*My Cart:*\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
    });
    message += `\nIs it possible to prepare this for tomorrow?`;
    return message;
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) return 'Please enter your name';
    if (!customerInfo.mobile.trim()) return 'Please enter your mobile number';
    if (!customerInfo.date) return 'Please select a delivery date';
    if (!customerInfo.time) return 'Please select a delivery time';
    if (customerInfo.deliveryType === 'delivery' && !customerInfo.address.trim()) {
      return 'Please enter your delivery address or fetch location';
    }
    return '';
  };

  const isFormValid = validateForm() === '';

  const handleCheckoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Fire-and-forget: save order to DB without blocking WhatsApp open
    api.submitOrder({
      customer_name: customerInfo.name,
      customer_mobile: customerInfo.mobile,
      delivery_type: customerInfo.deliveryType,
      delivery_date: customerInfo.date,
      delivery_time: customerInfo.time,
      address: customerInfo.address || undefined,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      subtotal: calculateTotal(),
    }).catch(err => console.error('Order save failed:', err));

    // Open WhatsApp synchronously (must stay in click handler to avoid popup blocker)
    window.open(`https://wa.me/917428666405?text=${encodeURIComponent(generateWhatsAppMessage())}`, '_blank');
  };

  const breadcrumb = (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        height: '200px',
        backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-stone-900/60" />
      <div className="relative text-center">
        <p className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-2">Babo's Home Kitchen</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Your Order</h1>
      </div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <>
        {breadcrumb}
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">Your Cart is Empty</h1>
          <p className="text-stone-600 mb-8">
            Looks like you haven't added any authentic Bengali delicacies to your cart yet.
          </p>
          <Link 
            to="/menu"
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-base"
          >
            Explore Menu
          </Link>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {breadcrumb}
      <div className="bg-stone-50 min-h-screen pt-12 pb-32 lg:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {/* <h2 className="text-2xl font-serif font-bold text-stone-900">Items</h2> */}
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 flex flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 truncate">{item.name}</h3>
                    <p className="text-stone-600 font-medium text-sm sm:text-base">{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <div className="flex items-center justify-between bg-stone-50 rounded-lg p-1 border border-stone-200 w-[112px] sm:w-[120px]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-white transition-colors ${
                          item.quantity === 1
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                      </button>
                      <span className="font-bold text-stone-800 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details Form */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 overflow-hidden">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Delivery Details</h2>
              
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-3">
                  <Info className="shrink-0 mt-0.5" size={20} />
                  <p>{formError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-stone-400" />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="w-full min-w-0 pl-10 pr-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Mobile Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-stone-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="mobile"
                        value={customerInfo.mobile}
                        onChange={handleInputChange}
                        className="w-full min-w-0 pl-10 pr-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Order Type *</label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="deliveryType" 
                        value="delivery"
                        checked={customerInfo.deliveryType === 'delivery'}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="text-center p-3 rounded-lg border border-stone-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 transition-all font-medium">
                        Delivery
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="deliveryType" 
                        value="takeaway"
                        checked={customerInfo.deliveryType === 'takeaway'}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="text-center p-3 rounded-lg border border-stone-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 transition-all font-medium">
                        Takeaway
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Date *</label>
                    <input 
                      type="date" 
                      name="date"
                      value={customerInfo.date}
                      onChange={handleInputChange}
                      min={todayStr}
                      className="w-full min-w-0 px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Time *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock size={18} className="text-stone-400" />
                      </div>
                      <input 
                        type="time" 
                        name="time"
                        value={customerInfo.time}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {customerInfo.deliveryType === 'delivery' && (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-stone-700">Delivery Address *</label>
                      <button 
                        type="button"
                        onClick={fetchLocation}
                        disabled={isFetchingLocation}
                        className="text-sm text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1"
                      >
                        <MapPin size={16} />
                        {isFetchingLocation ? 'Fetching...' : 'Choose my location'}
                      </button>
                    </div>
                    <textarea 
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                      placeholder="Enter your full address or use the button above to fetch location"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 sticky top-24">
              <h3 className="text-xl font-bold font-serif text-stone-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span>Calculated on WhatsApp</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold text-stone-900 mb-8">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
              
              <div className="hidden lg:block">
                <WhatsAppButton 
                  message={generateWhatsAppMessage()} 
                  text="Confirm on WhatsApp" 
                  className={`w-full justify-center text-lg py-4 ${!isFormValid ? 'opacity-40 pointer-events-none cursor-not-allowed' : ''}`}
                  onClick={handleCheckoutClick}
                />
                {!isFormValid && (
                  <p className="text-center text-xs text-stone-400 mt-2">Fill in delivery details to continue</p>
                )}
              </div>
              
              <div className="mt-8 space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-800 flex items-center gap-2">
                  <Info size={18} className="text-orange-500" />
                  Important Notes
                </h4>
                <ul className="text-sm text-stone-600 space-y-2 list-disc pl-5">
                  <li>Prices inclusive of GST</li>
                  <li>Orders require at least 1 day advance notice.</li>
                  <li>Place orders before 8 PM for next-day delivery.</li>
                  <li>Delivery charges apply based on distance.</li>
                  <li>We partner with Pidge Delivery Services.</li>
                  <li>Delhi NCR delivery available.</li>
                  <li>Takeaway available from our kitchen.</li>
                  <li> By ordering, you agree to our{' '}
                  <Link to="/terms" className="text-orange-600 hover:underline font-medium">Terms &amp; Conditions</Link>.</li>
                </ul>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-stone-600">Total</span>
          <span className="text-xl font-bold text-stone-900">₹{calculateTotal()}</span>
        </div>
        <WhatsAppButton 
          message={generateWhatsAppMessage()} 
          text="Confirm on WhatsApp" 
          className={`w-full justify-center text-lg py-3 ${!isFormValid ? 'opacity-40 pointer-events-none cursor-not-allowed' : ''}`}
          onClick={handleCheckoutClick}
        />
        {!isFormValid && (
          <p className="text-center text-xs text-stone-400 mt-2">Fill in delivery details above to continue</p>
        )}
      </div>

      {/* Same Day Order Modal */}
      {showSameDayModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSameDayModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSameDayModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold font-serif text-stone-900">Same-Day Order Request</h3>
            </div>
            <p className="text-stone-600 mb-6">
              As per our policy, Babo's Home Kitchen requires a minimum of <strong>1 day</strong> to prepare orders to ensure the highest quality and authenticity.
              <br /><br />
              If you need this order for today, please contact Babo directly on WhatsApp to check if an exception can be made before placing your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setCustomerInfo(prev => ({ ...prev, date: '' }));
                  setShowSameDayModal(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
              >
                Choose Another Date
              </button>
              <a
                href={`https://wa.me/917428666405?text=${encodeURIComponent(generateSameDayInquiry())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setCustomerInfo(prev => ({ ...prev, date: '' }));
                  setShowSameDayModal(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#128C7E] transition-colors text-center flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={18} />
                <span className="whitespace-nowrap">Ask Babo</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Next Day Order Modal */}
      {showNextDayModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold font-serif text-stone-900">Next-Day Cutoff Passed</h3>
            </div>
            <p className="text-stone-600 mb-6">
              Orders for next-day delivery must be placed before <strong>8 PM</strong>. 
              <br /><br />
              If you need this order for tomorrow, please contact Babo directly on WhatsApp to check if an exception can be made before placing your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setCustomerInfo(prev => ({ ...prev, date: '' }));
                  setShowNextDayModal(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
              >
                Choose Another Date
              </button>
              <a
                href={`https://wa.me/917428666405?text=${encodeURIComponent(generateNextDayInquiry())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setCustomerInfo(prev => ({ ...prev, date: '' }));
                  setShowNextDayModal(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#128C7E] transition-colors text-center flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={18} />
                <span className="whitespace-nowrap">Ask Babo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
