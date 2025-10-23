"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsAppButton() {
  const phoneNumber = "21623050038";
  const message = "Bonjour 👋, je souhaite avoir plus d'informations !";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-4 right-4
        flex items-center gap-2
        bg-green-500 text-white font-medium
        px-4 py-2 rounded-full shadow-lg
        hover:bg-green-600 active:scale-95
        transition-all duration-300 ease-in-out
        z-50
        sm:px-5 sm:py-3 sm:gap-3
      "
      style={{ whiteSpace: "nowrap" }}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp size={24} className="shrink-0" />
      <span className="hidden sm:inline">+216 23 050 038</span>
      <span className="inline sm:hidden text-sm">WhatsApp</span>
    </a>
  );
}
