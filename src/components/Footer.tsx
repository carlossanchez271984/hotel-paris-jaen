import React from 'react';
import { HOTEL_CONTACT } from '../data/rooms';
import { Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import hotelParisLogo from '../assets/images/gold_eiffel_icon_1787892659563.jpg';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#1a1a1a] text-[#fdfbf7] border-t border-[#e5e1da]/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#e5e1da]/15">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#c5a880]/50 bg-white flex items-center justify-center overflow-hidden p-1 shadow-xs rounded-sm">
                <img
                  src={hotelParisLogo}
                  alt="Hotel París Jaén Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-serif font-bold text-[#fdfbf7] uppercase tracking-wider">
                Hotel París
              </span>
            </div>
            <p className="text-xs text-[#8a817c] leading-relaxed font-editorial-sub italic">
              Tu mejor opción de descanso y comodidad. Habitaciones con baño privado, tv, wifi, cable y ventilador para tu máximo confort.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-[0.2em]">Contacto Directo</h4>
            <div className="text-xs text-[#8a817c] space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Teléfono / WhatsApp: <strong className="text-[#fdfbf7] font-normal">{HOTEL_CONTACT.phoneFormatted}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Correo: <span className="text-[#fdfbf7]">{HOTEL_CONTACT.email}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Ubicación: <span className="text-[#fdfbf7]">{HOTEL_CONTACT.address}</span></span>
              </div>
            </div>
          </div>

          {/* Schedules & Owner Link */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-[0.2em]">Horarios de Atención</h4>
            <div className="text-xs text-[#8a817c] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Recepción y Reservas: <strong className="text-[#fdfbf7] font-normal">24 horas / 7 días</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>Check-in: <strong className="text-[#fdfbf7] font-normal">08:00 AM</strong> | Check-out: <strong className="text-[#fdfbf7] font-normal">12:00 PM</strong></span>
              </div>
              <a
                href={`https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodeURIComponent(HOTEL_CONTACT.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#c5a880] hover:text-[#d6be99] font-medium mt-1 uppercase tracking-wider"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Escríbenos directamente por WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a817c]">
          <p>© {new Date().getFullYear()} Hotel París Jaén. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <p className="text-[11px] uppercase tracking-wider">Sistema oficial de reservas en línea</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-[#c5a880] hover:text-white underline cursor-pointer uppercase tracking-wider font-semibold"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

