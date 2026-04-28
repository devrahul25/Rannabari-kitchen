import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      name: "Ranjini Banerjee",
      role: "Regular Customer",
      content: "I recently had the pleasure of indulging in a plate of good mutton chops, and I must say it was a truly divine culinary experience. As a connoisseur of meat dishes, I have tasted my fair share of chops, but these mutton chops exceeded all expectations.What sets good mutton chops apart from the rest is the quality of the meat itself. The chefs clearly sourced the finest cuts, ensuring the meat was succulent and full of character. The chops were cooked to perfection, retaining their natural juices and achieving a perfect balance of tenderness and slight chewiness.The portion size was generous, ensuring that I left the table feeling truly satisfied. The mutton chops were undoubtedly the star of the show, and the quantity was more than enough to leave a lasting impression.",
      rating: 5,
      image: "https://babos.jaiveeru.site/uploads/gallery/ranjini.png"
    },
    {
      name: "Amitabh Das",
      role: "Event Host",
      content: "We ordered catering for my daughter's annaprashan. The food was the highlight of the event. The Chingri Malai Curry was a massive hit among all our guests.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Sneha Mukherjee",
      role: "Food Blogger",
      content: "Finding authentic Bengali food that doesn't feel commercialized is hard. Babo's Kitchen delivers that perfect home-cooked taste with premium quality ingredients.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Rahul Banerjee",
      role: "Regular Customer",
      content: "The Kolkata Mutton Biryani is a must-try. The aroma, the perfectly cooked potato, and the succulent mutton pieces make it an unforgettable experience.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Priya Chatterjee",
      role: "Custom Order Client",
      content: "I requested a specific dish from my childhood, and they nailed it! The attention to detail and willingness to accommodate custom requests is amazing.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Sandeep Roy",
      role: "Regular Customer",
      content: "Consistently delicious food. The packaging is great, the delivery is on time, and the taste is always authentic. It's our go-to place for weekend dinners.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">Customer Reviews</h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our patrons have to say about their experience with Babo's Home Kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-stone-100 relative">
              <Quote className="absolute top-6 right-6 text-yellow-100 w-12 h-12" />
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-stone-700 mb-8 relative z-10 italic">"{review.content}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-stone-900">{review.name}</h4>
                  <p className="text-sm text-stone-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-14">
          <a
            href="https://www.google.com/search?sca_esv=ec7c3bdcf43043be&rlz=1C1UEAD_enIN1103IN1103&sxsrf=ANbL-n6H7sTNUnsxbe1sKvz7C5jXKgRoYw:1775204154718&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWFKEVraJLFPsGQiyKYtxbBt8XbWWHp5BYmem24NNaaag2dH4JoIeLqPoI8gtbcbaTUziwuRdNEAb63YMJ6fCcUVm6ch3YiMpvjSNH4odrsS_RS8Jw%3D%3D&q=Babo%27s+Home+Kitchen+Reviews&sa=X&ved=2ahUKEwjExK7ontGTAxVpUGcHHX1KLbYQ0bkNegQIPRAF&biw=1536&bih=730&dpr=1.25"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            View all Google reviews
          </a>
          <a
            href="https://www.google.com/search?sca_esv=ec7c3bdcf43043be&sxsrf=ANbL-n43mDkMrXznQYLcDnQKH15dZszlng:1775204388996&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWFKEVraJLFPsGQiyKYtxbBt8XbWWHp5BYmem24NNaaag2dH4JoIeLqPoI8gtbcbaTUziwuRdNEAb63YMJ6fCcUVm6ch3YiMpvjSNH4odrsS_RS8Jw%3D%3D&q=Babo%27s+Home+Kitchen+Reviews&sa=X&ved=2ahUKEwjc4InYn9GTAxUDwzgGHduuEpAQ0bkNegQIQRAF&biw=1698&bih=813&dpr=1.13#lrd=0x390ce7475a89f5ed:0x2d6637ec50166ef7,3,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Star size={16} fill="currentColor" />
            Write a review
          </a>
        </div>
      </div>
    </div>
  );
}
