import { Link, useLocation } from 'react-router-dom';
import { HardHat, ArrowLeft } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/media': 'Media',
  '/brand': 'Brand',
  '/csr': 'CSR',
  '/partner': 'Our Partners',
  '/feed-a-child': 'Feed a Child',
  '/faqs': 'FAQs',
};

export default function UnderConstruction() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'This Page';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-stone-50">
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <HardHat size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">{title}</h1>
        <p className="text-lg font-semibold text-orange-600 mb-3">Page Under Construction</p>
        <p className="text-stone-500 text-sm mb-8">
          We're working on something great. Check back soon!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
