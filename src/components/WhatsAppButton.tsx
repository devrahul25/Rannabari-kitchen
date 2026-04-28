import React from 'react';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  text?: string;
  isFloating?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function WhatsAppButton({ 
  message = "Hi, I want to place an order for tomorrow", 
  className = "",
  text,
  isFloating = false,
  onClick
}: WhatsAppButtonProps) {
  const phoneNumber = "917428666405"; // Primary WhatsApp number
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  if (isFloating) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`fixed right-6 bg-[#25D366] text-white p-4 rounded-full hover:bg-[#128C7E] transition-colors z-50 flex items-center justify-center shadow-lg ${className || 'bottom-6'}`}
        aria-label="Order on WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#128C7E] transition-colors text-base ${className}`}
    >
      <WhatsAppIcon size={20} className="shrink-0" />
      <span className="text-center leading-snug">{text || "Order on WhatsApp"}</span>
    </a>
  );
}
