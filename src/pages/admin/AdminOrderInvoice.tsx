import React, { useState } from 'react';
import { X, Download, Send, Plus, Minus } from 'lucide-react';
import { Order } from '../../services/api';
import { toast } from 'sonner';

interface InvoiceProps {
  order: Order;
  onClose: () => void;
}

export default function AdminOrderInvoice({ order, onClose }: InvoiceProps) {
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  // SQLite CURRENT_TIMESTAMP has no timezone marker — normalise to UTC.
  const parseUtcDate = (iso: string) =>
    new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');

  const itemsTotal = order.items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  const subtotal = itemsTotal + deliveryFee;
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const grandTotal = subtotal + cgst + sgst;

  const generateInvoiceHTML = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #333; }
    .invoice { max-width: 800px; margin: 0 auto; border: 2px solid #333; }
    .header { background: #f97316; color: white; padding: 20px; text-align: center; }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
    .tagline { font-size: 14px; opacity: 0.95; }
    .info-section { padding: 20px; border-bottom: 1px solid #ddd; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-block h3 { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
    .info-block p { font-size: 14px; line-height: 1.6; }
    .invoice-meta { text-align: right; padding: 20px; background: #f9fafb; border-bottom: 1px solid #ddd; }
    .invoice-meta h2 { font-size: 24px; margin-bottom: 8px; }
    .invoice-meta p { font-size: 13px; color: #666; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f3f4f6; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { font-size: 12px; text-transform: uppercase; color: #666; font-weight: 600; }
    td { font-size: 14px; }
    .text-right { text-align: right; }
    .summary { margin: 20px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .summary-row.total { border-top: 2px solid #333; margin-top: 12px; padding-top: 12px; font-size: 18px; font-weight: bold; }
    .footer { padding: 20px; background: #f9fafb; text-align: center; border-top: 1px solid #ddd; }
    .footer p { font-size: 13px; color: #666; margin-bottom: 4px; }
    @media print {
      body { padding: 0; }
      .invoice { border: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="logo">BABO'S HOME KITCHEN</div>
      <div class="tagline">Authentic Bengali Cuisine</div>
    </div>

    <!-- Invoice Meta -->
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>Invoice #: <strong>${order.id}</strong></p>
      <p>Date: <strong>${parseUtcDate(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></p>
      <p>Order Date: <strong>${order.delivery_date}</strong></p>
    </div>

    <!-- Customer & Business Info -->
    <div class="info-section">
      <div class="info-grid">
        <div class="info-block">
          <h3>Bill To</h3>
          <p><strong>${order.customer_name}</strong></p>
          <p>${order.customer_mobile}</p>
          ${order.address ? `<p>${order.address}</p>` : ''}
          <p>Delivery Type: <strong>${order.delivery_type === 'delivery' ? 'Home Delivery' : 'Takeaway'}</strong></p>
        </div>
        <div class="info-block">
          <h3>From</h3>
          <p><strong>Babo's Home Kitchen</strong></p>
          <p>N-5, Behind HDFC Bank</p>
          <p>Block N, Kalkaji, New Delhi</p>
          <p>Delhi 110019</p>
          <p>Phone: +91 7428666405</p>
          <p>Email: baboshomekitchen@gmail.com</p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Rate</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, i) => {
          const rate = parsePrice(item.price);
          const amount = rate * item.quantity;
          return `
        <tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">₹${rate.toLocaleString('en-IN')}</td>
          <td class="text-right">₹${amount.toLocaleString('en-IN')}</td>
        </tr>`;
        }).join('')}
        ${deliveryFee > 0 ? `
        <tr>
          <td>${order.items.length + 1}</td>
          <td>Delivery Charges</td>
          <td class="text-right">1</td>
          <td class="text-right">₹${deliveryFee.toLocaleString('en-IN')}</td>
          <td class="text-right">₹${deliveryFee.toLocaleString('en-IN')}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div class="summary-row">
        <span>CGST (2.5%):</span>
        <span>₹${cgst.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>SGST (2.5%):</span>
        <span>₹${sgst.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Grand Total:</span>
        <span>₹${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for your order!</strong></p>
      <p>For any queries, contact us at +91 7428666405 or baboshomekitchen@gmail.com</p>
      <p style="margin-top: 12px; font-size: 11px; color: #999;">This is a computer-generated invoice.</p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const html = generateInvoiceHTML();
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, filename: `invoice_${order.id}.pdf` }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🧾 *Invoice for Order #${order.id}*\n\n` +
      `📋 Customer: ${order.customer_name}\n` +
      `📞 Mobile: ${order.customer_mobile}\n` +
      `📅 Delivery Date: ${order.delivery_date} at ${order.delivery_time}\n\n` +
      `*Items:*\n${order.items.map(item => `• ${item.quantity}× ${item.name} — ₹${(parsePrice(item.price) * item.quantity).toLocaleString('en-IN')}`).join('\n')}\n` +
      (deliveryFee > 0 ? `• Delivery Charges — ₹${deliveryFee.toLocaleString('en-IN')}\n` : '') +
      `\n*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n` +
      `*CGST (2.5%):* ₹${cgst.toFixed(2)}\n` +
      `*SGST (2.5%):* ₹${sgst.toFixed(2)}\n` +
      `\n*Grand Total:* ₹${grandTotal.toFixed(2)}\n\n` +
      `Thank you for ordering from Babo's Home Kitchen! 🍛`;

    const digits = order.customer_mobile.replace(/\D/g, '');
    const waNumber = digits.length === 10 ? `91${digits}` : digits;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-stone-900">Invoice for Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="p-6">
          <div className="border-2 border-stone-900 rounded-lg overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-orange-600 text-white text-center py-6">
              <h1 className="text-3xl font-bold mb-2">BABO'S HOME KITCHEN</h1>
              <p className="text-sm">Authentic Bengali Cuisine</p>
            </div>

            {/* Invoice Meta */}
            <div className="bg-stone-50 px-6 py-4 text-right border-b border-stone-200">
              <h2 className="text-2xl font-bold text-stone-900 mb-2">INVOICE</h2>
              <p className="text-sm text-stone-600">Invoice #: <strong>#{order.id}</strong></p>
              <p className="text-sm text-stone-600">
                Date: <strong>{parseUtcDate(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
              </p>
              <p className="text-sm text-stone-600">Order Date: <strong>{order.delivery_date}</strong></p>
            </div>

            {/* Customer & Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-stone-200">
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase mb-2">Bill To</h3>
                <p className="font-bold text-stone-900">{order.customer_name}</p>
                <p className="text-sm text-stone-600">{order.customer_mobile}</p>
                {order.address && <p className="text-sm text-stone-600 mt-1">{order.address}</p>}
                <p className="text-sm text-stone-600 mt-2">
                  Delivery Type: <strong>{order.delivery_type === 'delivery' ? 'Home Delivery' : 'Takeaway'}</strong>
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase mb-2">From</h3>
                <p className="font-bold text-stone-900">Babo's Home Kitchen</p>
                <p className="text-sm text-stone-600">N-5, Behind HDFC Bank</p>
                <p className="text-sm text-stone-600">Block N, Kalkaji, New Delhi</p>
                <p className="text-sm text-stone-600">Delhi 110019</p>
                <p className="text-sm text-stone-600 mt-2">Phone: +91 7428666405</p>
                <p className="text-sm text-stone-600">Email: baboshomekitchen@gmail.com</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-100 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Item</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item, i) => {
                    const rate = parsePrice(item.price);
                    const amount = rate * item.quantity;
                    return (
                      <tr key={i}>
                        <td className="px-4 py-3 text-sm text-stone-600">{i + 1}</td>
                        <td className="px-4 py-3 text-sm text-stone-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-stone-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-stone-900 text-right">₹{rate.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-sm text-stone-900 text-right font-medium">
                          ₹{amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Delivery Fee Row with inline controls */}
                  <tr className="bg-stone-50">
                    <td className="px-4 py-3 text-sm text-stone-600">{order.items.length + 1}</td>
                    <td className="px-4 py-3 text-sm text-stone-900">
                      <div className="flex items-center gap-2">
                        <span>Delivery Charges</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDeliveryFee(Math.max(0, deliveryFee - 10))}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-stone-300 hover:border-orange-500 hover:text-orange-600 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 px-2 py-1 text-xs border border-stone-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => setDeliveryFee(deliveryFee + 10)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-stone-300 hover:border-orange-500 hover:text-orange-600 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-900 text-right">1</td>
                    <td className="px-4 py-3 text-sm text-stone-900 text-right">₹{deliveryFee.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-stone-900 text-right font-medium">
                      ₹{deliveryFee.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="p-6 space-y-2 border-t border-stone-200">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Subtotal:</span>
                <span className="font-medium text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">CGST (2.5%):</span>
                <span className="font-medium text-stone-900">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">SGST (2.5%):</span>
                <span className="font-medium text-stone-900">₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-stone-900">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-stone-50 px-6 py-4 text-center border-t border-stone-200">
              <p className="font-semibold text-stone-900 mb-1">Thank you for your order!</p>
              <p className="text-xs text-stone-600">For any queries, contact us at +91 7428666405 or baboshomekitchen@gmail.com</p>
              <p className="text-xs text-stone-400 mt-2">This is a computer-generated invoice.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Send size={18} />
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
