import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '../context/SEOContext';

const DEFAULTS: Record<string, { title: string; description: string; keywords: string; ogImage: string }> = {
  '/': {
    title: "Babo's Home Kitchen | Authentic Bengali Food Delivery Delhi NCR",
    description: 'Order authentic home-cooked Bengali food in Delhi NCR. Kosha Mangsho, Sorse Ilish, Galda Chingri Malai Curry, Kolkata Biryani and more. Made fresh to order by Babo.',
    keywords: 'Bengali food delivery Delhi, authentic Bengali food Delhi NCR, home cooked Bengali food',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/menu': {
    title: "Bengali Food Menu | Babo's Home Kitchen Delhi",
    description: 'Explore our Bengali menu — Sorse Ilish, Kosha Mangsho, Prawn Malai Curry, Kolkata Mutton Biryani, Crab Curry and more. Order fresh, home-cooked Bengali food in Delhi.',
    keywords: 'Bengali food menu Delhi, Sorse Ilish Delhi, Kosha Mangsho order Delhi',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/about': {
    title: "About Babo | The Story Behind Babo's Home Kitchen Delhi",
    description: "Meet Dipayan Mazumdar — Babo. An advertising professional and passionate home chef bringing authentic Bengali recipes from his mother and grandmother to your table in Delhi NCR.",
    keywords: "Bengali home chef Delhi, authentic Bengali cooking Delhi NCR",
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/contact': {
    title: "Contact Us — Babo's Home Kitchen",
    description: "Get in touch with Babo's Home Kitchen for orders, enquiries, and catering requests.",
    keywords: 'contact Babo kitchen, Bengali food order, catering enquiry',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/catering': {
    title: "Bengali Catering Delhi | Babo's Home Kitchen",
    description: 'Bengali catering in Delhi NCR for intimate dinners to gatherings of 50. Fresh, handcrafted dishes made to order. Contact Babo to book your event.',
    keywords: 'Bengali catering Delhi, Bengali food catering Delhi NCR, home chef catering Delhi',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/how-it-works': {
    title: "How It Works — Babo's Home Kitchen",
    description: 'Learn how to place your order with Babo\'s Home Kitchen — simple steps to get fresh Bengali food delivered.',
    keywords: 'how to order, delivery process, Babo kitchen ordering',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/custom-orders': {
    title: "Custom Orders — Babo's Home Kitchen",
    description: 'Place a custom food order with Babo\'s Home Kitchen for special occasions, get Bengali dishes made to your preference.',
    keywords: 'custom order Bengali food, special order, Babo Home Kitchen custom',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/reviews': {
    title: "Customer Reviews — Babo's Home Kitchen",
    description: 'Read what our customers say about Babo\'s Home Kitchen — authentic Bengali food loved across Delhi NCR.',
    keywords: 'Babo Home Kitchen reviews, Bengali food reviews, customer testimonials',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/media': {
    title: "Media & Gallery — Babo's Home Kitchen",
    description: 'Browse photos and media from Babo\'s Home Kitchen — our food, events, and behind-the-scenes moments.',
    keywords: 'Babo kitchen gallery, Bengali food photos, food media',
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/terms': {
    title: "Terms & Conditions — Babo's Home Kitchen",
    description: 'Read the terms and conditions for using Babo\'s Home Kitchen services and placing food orders.',
    keywords: "Babo's Home Kitchen terms, conditions, food order policy",
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
  '/refund': {
    title: "Refund Policy — Babo's Home Kitchen",
    description: 'Understand the refund and cancellation policy at Babo\'s Home Kitchen for all food orders.',
    keywords: "Babo's Home Kitchen refund policy, cancellation, food order refund",
    ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
  },
};

const SITE_DEFAULT = {
  title: "Babo's Home Kitchen | Authentic Bengali Food Delivery Delhi NCR",
  description: 'Order authentic home-cooked Bengali food in Delhi NCR. Kosha Mangsho, Sorse Ilish, Galda Chingri Malai Curry, Kolkata Biryani and more. Made fresh to order by Babo.',
  keywords: "Bengali food delivery Delhi, authentic Bengali food Delhi NCR, home cooked Bengali food",
  ogImage: 'https://baboshomekitchen.in/uploads/gallery/main-banner-image.png',
};

function setTag(selector: string, attr: string, value: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEOHead() {
  const { pathname } = useLocation();
  const { settings, loading } = useSEO();

  useEffect(() => {
    // Wait until the API call is done — avoids flashing defaults before DB data arrives
    if (loading) return;

    // Normalise trailing slash so '/menu/' matches '/menu' in the DB
    const normPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const row = settings.find((s) => s.page_path === normPath);
    const def = DEFAULTS[normPath] || SITE_DEFAULT;

    const title = row?.meta_title || def.title;
    const description = row?.meta_description || def.description;
    const keywords = row?.meta_keywords || def.keywords;
    const ogImage = row?.og_image || def.ogImage;

    // Title
    document.title = title;

    // Standard meta
    setTag('meta[name="description"]', 'name', 'description', description);
    setTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // OG
    setTag('meta[property="og:title"]', 'property', 'og:title', title);
    setTag('meta[property="og:description"]', 'property', 'og:description', description);
    setTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // Twitter card
    setTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
  }, [pathname, settings, loading]);

  return null;
}
