import React from 'react';
import { Reservation } from '../types';
import { HOTEL_CONTACT, ROOMS_DATA } from '../data/rooms';
import { 
  CheckCircle2, 
  X, 
  Calendar, 
  Clock, 
  Bed, 
  User as UserIcon, 
  Phone, 
  Send, 
  Share2, 
  Sparkles,
  Printer
} from 'lucide-react';

interface BookingConfirmationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  reservation,
  onClose,
  onViewMyBookings,
}) => {
  const room = ROOMS_DATA.find((r) => r.id === reservation.roomId);

  // Format the WhatsApp message with full details
  const whatsappMessage = `*RESERVACIÓN - HOTEL PARÍS JAÉN* 🏨
*Código:* ${reservation.id}
*Titular:* ${reservation.guestName}
*Habitación:* ${reservation.roomName}
*Ingreso (Check-in):* ${reservation.checkIn}
*Salida (Check-out):* ${reservation.checkOut}
*Estadía:* ${reservation.totalDays} días (${reservation.totalNights} noches)
*Huéspedes:* ${reservation.adults} adultos ${reservation.children > 0 ? `+ ${reservation.children} niños` : ''}
*Llegada estimada:* ${reservation.arrivalTime || '08:00 AM'}
${reservation.specialRequests ? `*Notas:* ${reservation.specialRequests}\n` : ''}
Hola, acabo de registrar mi reservación en la web de Hotel París Jaén. ¿Podrían confirmarme la disponibilidad? ¡Muchas gracias!`;

  const whatsappUrl = `https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSendToWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e5e1da] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfbf7] p-6 sm:p-8 relative border-b border-[#e5e1da]">
          <button
            id="btn-close-confirmation"
            onClick={onClose}
            className="absolute top-5 right-5 text-[#8a817c] hover:text-white p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 border border-[#c5a880]/40 bg-[#c5a880]/15 text-[#c5a880] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#c5a880]">
                ¡Reservación Exitosa!
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#fdfbf7] tracking-wider uppercase">
                Hotel París Jaén
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#e5e1da]/80 mt-1 max-w-md font-editorial-sub italic">
            Tu solicitud de estadía ha sido registrada con éxito. A continuación encontrarás el comprobante oficial de tu reserva.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-[#242424] border border-[#e5e1da]/20 px-3.5 py-1.5 text-xs text-[#c5a880]">
            <span className="text-[10px] uppercase tracking-wider">CÓDIGO DE RESERVA:</span>
            <strong className="text-white font-mono text-sm tracking-wider">{reservation.id}</strong>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#fdfbf7]">
          
          {/* Main Booking Summary Card */}
          <div className="bg-white p-5 border border-[#e5e1da] shadow-xs space-y-4">
            
            {/* Room info */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e5e1da]">
              <div className="flex items-center gap-3.5">
                <img
                  src={room?.image}
                  alt={reservation.roomName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover border border-[#e5e1da]"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8a817c] font-medium mb-0.5">
                    <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{room?.bedType}</span>
                  </div>
                  <h4 className="text-lg font-serif font-bold text-[#1a1a1a]">
                    {reservation.roomName}
                  </h4>
                  <p className="text-xs text-[#8a817c]">
                    {reservation.adults} Adultos {reservation.children > 0 ? `• ${reservation.children} Niños` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates & Duration Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#faf8f5] border border-[#e5e1da] p-3.5 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-[#8a817c] uppercase tracking-wider block">Ingreso</span>
                <span className="font-semibold text-[#1a1a1a] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                  {reservation.checkIn}
                </span>
                <span className="text-[10px] text-[#8a817c]">Desde 08:00 AM</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#8a817c] uppercase tracking-wider block">Salida</span>
                <span className="font-semibold text-[#1a1a1a] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                  {reservation.checkOut}
                </span>
                <span className="text-[10px] text-[#8a817c]">Hasta 12:00 PM</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#8a817c] uppercase tracking-wider block">Estadía Total</span>
                <span className="font-serif font-bold text-[#1a1a1a] flex items-center gap-1 mt-0.5 text-sm">
                  <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                  {reservation.totalDays} Días / {reservation.totalNights} Noches
                </span>
              </div>
            </div>

            {/* Included Amenities reminder */}
            <div className="pt-2">
              <h5 className="text-[10px] font-semibold text-[#8a817c] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Servicios incluidos en la habitación</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {room?.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#faf8f5] text-[#1a1a1a] px-2.5 py-1 border border-[#e5e1da] font-normal"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Guest details */}
            <div className="pt-3 border-t border-[#e5e1da] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4a4a4a]">
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-[#8a817c]" />
                <span>Huésped: <strong className="text-[#1a1a1a]">{reservation.guestName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8a817c]" />
                <span>Teléfono: <strong className="text-[#1a1a1a]">{reservation.guestPhone}</strong></span>
              </div>
            </div>

          </div>

          {/* Quick Actions (WhatsApp Forwarding Button is prominent) */}
          <div className="space-y-3">
            <button
              id="btn-send-whatsapp-reservation"
              onClick={handleSendToWhatsApp}
              className="w-full bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#fdfbf7] font-semibold py-3.5 px-4 uppercase tracking-widest border border-[#1a1a1a] shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#c5a880]" />
              <span>Enviar comprobante a WhatsApp (+51 996 063 817)</span>
            </button>

            <div className="flex gap-2">
              <button
                id="btn-view-my-reservations"
                onClick={onViewMyBookings}
                className="flex-1 bg-white hover:bg-[#faf8f5] text-[#1a1a1a] border border-[#e5e1da] font-semibold py-2.5 px-3 uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Ver Mis Reservaciones</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-white hover:bg-[#faf8f5] text-[#1a1a1a] border border-[#e5e1da] font-semibold py-2.5 px-3 uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Imprimir comprobante"
              >
                <Printer className="w-3.5 h-3.5 text-[#8a817c]" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                id="btn-new-reservation-close"
                onClick={onClose}
                className="bg-[#faf8f5] hover:bg-white text-[#1a1a1a] border border-[#e5e1da] font-semibold py-2.5 px-4 uppercase tracking-wider text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
