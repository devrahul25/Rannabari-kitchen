import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const exploreLinks: { name: string; path: string; external?: boolean }[] = [
  { name: 'Menu', path: '/menu' },
  { name: 'Catering', path: '/catering' },
  { name: 'Custom Orders', path: '/custom-orders' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Order on WhatsApp', path: 'https://wa.me/917428666405', external: true },
  { name: 'Reviews', path: 'https://www.google.com/search?sca_esv=ec7c3bdcf43043be&rlz=1C1UEAD_enIN1103IN1103&sxsrf=ANbL-n6H7sTNUnsxbe1sKvz7C5jXKgRoYw:1775204154718&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWFKEVraJLFPsGQiyKYtxbBt8XbWWHp5BYmem24NNaaag2dH4JoIeLqPoI8gtbcbaTUziwuRdNEAb63YMJ6fCcUVm6ch3YiMpvjSNH4odrsS_RS8Jw%3D%3D&q=Babo%27s+Home+Kitchen+Reviews&sa=X&ved=2ahUKEwjExK7ontGTAxVpUGcHHX1KLbYQ0bkNegQIPRAF&biw=1536&bih=730&dpr=1.25' },
  { name: 'FAQs', path: '/faqs' },
];

const companyLinks: { name: string; path: string; external?: boolean }[] = [
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Media Coverage', path: '/media' },
  { name: 'Brand Repository', path: '/brand' },
  { name: 'CSR Activities', path: '/csr' },
  { name: 'Our Partners', path: '/partner' },
  { name: 'Feed a child', path: '/feed-a-child' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 mb-6 transition-opacity hover:opacity-90">
              <img src="https://babos.jaiveeru.site/uploads/gallery/footer-logo-y.svg" alt="Babo's Home Kitchen" className="h-25 w-auto brightness-100 " /> 
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-center lg:text-left">
              Authentic Bengali delicacies, made fresh only when you order. No precooking. No shortcuts.<br />
              Just the warmth, nostalgia, and soul of a true Kolkata home kitchen, now in Delhi NCR.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="https://www.facebook.com/baboshomekitchenofficial" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                <img src="https://babos.jaiveeru.site/uploads/gallery/fb.svg" alt="Facebook" width={32} height={32} />
              </a>
              <a href="https://www.instagram.com/baboshomekitchen/" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
               <img src="https://babos.jaiveeru.site/uploads/gallery/insta.svg" alt="Instagram" width={32} height={32} />
              </a>
              <a href="https://x.com/babos_home" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                 <img src="https://babos.jaiveeru.site/uploads/gallery/x.svg" alt="Twitter" width={32} height={32} />
              </a>
              <a href="https://www.youtube.com/@baboshomekitchen" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
               <img src="https://babos.jaiveeru.site/uploads/gallery/Layer_2.svg" alt="YouTube" width={32} height={32} />
              </a>
              {/* <a href="https://linktr.ee/babohomekitchen" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <img src="https://babos.jaiveeru.site/uploads/gallery/link.svg" alt="LinkedIn" width={32} height={32} />

                
              </a> */}
              {/* <a href="https://linktr.ee/babohomekitchen" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
               <svg fill="none" height="32" width="32" viewBox="0 0 28 28" class="animation_rotate__SBERF"><path d="m15.7603 6.829 4.6725-4.80317 2.712 2.77734-4.9012 4.67248h6.8944v3.85565h-6.9271l4.9339 4.7922-2.712 2.7229-6.6983-6.731-6.69829 6.731-2.712-2.712 4.93387-4.7923h-6.92703v-3.86645h6.89436l-4.9012-4.67248 2.712-2.77734 4.67249 4.80317v-6.829h4.0516zm-4.0516 12.0243h4.0516v9.1489h-4.0516z" fill="#fcb316"></path></svg>
              </a>  */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Explore</h3>
                <ul className="space-y-3">
                  {exploreLinks.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                          {link.name}
                        </a>
                      ) : (
                        <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                          {link.name}
                        </a>
                      ) : (
                        <Link to={link.path} target="_blank" className="text-sm hover:text-white transition-colors">
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>N-5, Behind HDFC Bank, Block N, Kalkaji, New Delhi, Delhi 110019</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>+91 7428666405</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span>baboshomekitchen@gmail.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <WhatsAppButton text="Message Us" className="w-full justify-center" />
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-stone-500">
            <p>&copy; {new Date().getFullYear()} Babo's Home Kitchen. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <span className="text-stone-700">•</span>
              <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              <span className="text-stone-700">•</span>
              <a 
                  href="https://baboshomekitchen.in/uploads/gallery/fssai-license.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  <img 
                    src="https://baboshomekitchen.in/uploads/gallery/fssai.svg" 
                    alt="FSSAI" 
                    width={32} 
                    height={32} 
                  />
                </a>

              
            </div>
          </div>
          <p className="text-xs text-stone-500 text-center lg:text-right">
            Made with love for the love of Bengali food <span className="text-stone-700 mx-2 hidden sm:inline">•</span><br className="sm:hidden" /> <Link to="https://jaiveeru.co.in" className="text-[#fcb316] hover:text-white transition-colors" >Powered by JaiVeeru Creatives</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
