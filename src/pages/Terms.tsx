import React from 'react';

export default function Terms() {
  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 rounded-3xl border border-stone-200">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Terms and Conditions</h1>
          
          <div className="space-y-8 text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to Babo's Home Kitchen. By placing an order with us, you agree to be bound by these Terms and Conditions. Please read them carefully before ordering any food from our kitchen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Ordering Process</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All orders must be placed at least 1 day (24 hours) in advance.</li>
                <li>Orders are confirmed only after full payment is received.</li>
                <li>We accept orders via WhatsApp and phone calls only.</li>
                <li>We reserve the right to decline orders if we have reached our daily capacity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Pricing and Payment</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All prices are listed in Indian Rupees (INR).</li>
                <li>Prices are subject to change without prior notice, but changes will not affect orders that have already been confirmed.</li>
                <li>Payment must be made via UPI, bank transfer, or other accepted digital payment methods at the time of ordering.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Delivery charges are extra and calculated based on the distance from our kitchen in Kalkaji, New Delhi.</li>
                <li>While we strive to deliver at the requested time, delivery times are estimates and may be affected by traffic, weather, or other unforeseen circumstances.</li>
                <li>Please ensure someone is available to receive the order at the specified delivery address.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Food Safety and Allergies</h2>
              <p className="mb-2">
                We prepare our food in a home kitchen environment. While we maintain the highest standards of hygiene and cleanliness, our kitchen handles various ingredients including nuts, dairy, gluten, and seafood.
              </p>
              <p>
                If you have any severe food allergies, please inform us at the time of placing your order. However, we cannot guarantee a 100% allergen-free environment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms and conditions at any time. Any changes will be effective immediately upon posting on this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at:
                <br />
                <strong>Email:</strong> baboshomekitchen@gmail.com
                <br />
                <strong>Phone:</strong> +91 7428666405
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
