import React from 'react';

export default function Refund() {
  return (
    <div className="bg-stone-50 min-h-screen py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 rounded-3xl border border-stone-200">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Refund and Cancellation Policy</h1>
          
          <div className="space-y-8 text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">1. General Policy</h2>
              <p>
                At Babo's Home Kitchen, every meal is prepared fresh and specifically for your order. Because we do not store or reheat food, and we procure fresh ingredients based on confirmed orders, our cancellation and refund policies are strict.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Order Cancellations</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>More than 24 hours notice:</strong> If you cancel your order at least 24 hours before the scheduled delivery time, you are eligible for a full refund or store credit.
                </li>
                <li>
                  <strong>Less than 24 hours notice:</strong> Cancellations made within 24 hours of the scheduled delivery time are <strong>non-refundable</strong>. This is because ingredients have already been purchased and preparation may have begun.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Refunds for Quality Issues</h2>
              <p className="mb-4">
                We take immense pride in the quality and authenticity of our food. If you are unsatisfied with your order due to a genuine quality issue (e.g., spoiled food, incorrect items delivered):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Please contact us within <strong>2 hours</strong> of receiving your delivery.</li>
                <li>Provide photographic evidence of the issue via WhatsApp to +91 7428666405.</li>
                <li>Do not discard the food until we have reviewed your complaint.</li>
              </ul>
              <p className="mt-4">
                If the claim is verified, we will offer a replacement meal or a full/partial refund, depending on the situation. Refunds will not be provided for subjective taste preferences (e.g., "too spicy" or "not salty enough").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Delivery Failures</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>If an order cannot be delivered due to an incorrect address provided by the customer, or if the customer is unreachable at the time of delivery, no refund will be issued.</li>
                <li>If we fail to deliver your order due to unforeseen circumstances on our end (e.g., severe weather, kitchen emergencies), a full refund will be processed immediately.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Refund Processing Time</h2>
              <p>
                Approved refunds will be processed back to the original method of payment. Please allow 5-7 business days for the amount to reflect in your bank account, depending on your bank's processing times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Contact Us</h2>
              <p>
                For any cancellation or refund requests, please reach out to us immediately:
                <br />
                <strong>WhatsApp/Phone:</strong> +91 7428666405
                <br />
                <strong>Email:</strong> baboshomekitchen@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
