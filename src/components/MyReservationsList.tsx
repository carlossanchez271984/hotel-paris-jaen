import React from 'react';
import { Reservation } from '../types';
import { HOTEL_CONTACT, ROOMS_DATA } from '../data/rooms';
import { 
  Calendar, 
  Clock, 
  Bed, 
  Trash2, 
  Send, 
  PlusCircle, 
  CheckCircle2, 
  Hotel,
  AlertCircle
} from 'lucide-react';

interface MyReservationsListProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onNewReservation: () => void;
}

export const MyReservationsList: React.FC<MyReservationsListProps> = ({
  reservations,
  onCancelReservation,
  onNewReservation,
}) => {
  if (reservations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-[#faf8f5] text-[#1a1a1a] flex items-center justify-center mx-auto mb-4 border border-[#e5e1da]">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2 tracking-wide">
          No tienes reservaciones activas
        </h3>
        <p className="text-[#8a817c] text-xs max-w-md mx-auto mb-6 font-editorial-sub italic">
          Aún no has registrado ninguna estadía en Hotel París Jaén. Puedes crear una nueva reserva en cualquier momento.
        </p>
        <button
          id="btn-empty-create-reservation"
          onClick={onNewReservation}
          className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#fdfbf7] font-semibold px-6 py-3 border border-[#1a1a1a] transition-all cursor-pointer text-xs uppercase tracking-widest"
        >
          <PlusCircle className="w-4 h-4 text-[#c5a880]" />
          <span>Hacer mi Primera Reservación</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-4 border-b border-[#e5e1da]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] tracking-wide">
            Mis Reservaciones en Hotel París Jaén
          </h2>
          <p className="text-xs text-[#8a817c] mt-1 font-editorial-sub italic">
            Historial de tus solicitudes de hospedaje y estadías registradas
          </p>
        </div>

        <button
          id="btn-header-new-reservation"
          onClick={onNewReservation}
          className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#fdfbf7] font-semibold px-4 py-2.5 border border-[#1a1a1a] transition-all cursor-pointer text-xs uppercase tracking-wider"
        >
          <PlusCircle className="w-4 h-4 text-[#c5a880]" />
          <span>Nueva Reservación</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {reservations.map((res) => {
          const room = ROOMS_DATA.find((r) => r.id === res.roomId);
          
          const shareMsg = `*CONSULTA RESERVACIÓN HOTEL PARÍS*\n*Código:* ${res.id}\n*Habitación:* ${res.roomName}\n*Fechas:* ${res.checkIn} al ${res.checkOut} (${res.totalDays} días)\n*Huésped:* ${res.guestName}\nHola, quisiera verificar el estado de mi reserva.`;
          const whatsappUrl = `https://wa.me/${HOTEL_CONTACT.whatsappNumber}?text=${encodeURIComponent(shareMsg)}`;

          return (
            <div
              key={res.id}
              className="bg-white p-5 sm:p-6 border border-[#e5e1da] shadow-xs hover:border-[#1a1a1a]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Room & Details */}
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={room?.image}
                  alt={res.roomName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-[#e5e1da] shrink-0"
                />

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-medium bg-[#faf8f5] text-[#1a1a1a] px-2.5 py-0.5 border border-[#e5e1da] tracking-wider">
                      {res.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#1a1a1a] bg-[#faf8f5] px-2.5 py-0.5 border border-[#e5e1da] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#c5a880]" />
                      {res.status === 'confirmada' ? 'Registrada' : res.status}
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-[#1a1a1a] tracking-wide">
                    {res.roomName}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#4a4a4a]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>{res.checkIn} → {res.checkOut}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8a817c]" />
                      <span>Estadía: <strong className="text-[#1a1a1a]">{res.totalDays} Días ({res.totalNights} Noches)</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-[#8a817c]">
                    Titular: <span className="font-semibold text-[#1a1a1a]">{res.guestName}</span> ({res.adults} adultos)
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#e5e1da]">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#fdfbf7] text-xs font-semibold px-4 py-2.5 border border-[#1a1a1a] uppercase tracking-wider transition-colors shadow-2xs"
                  title="Consultar por WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    if (window.confirm('¿Está seguro de que desea cancelar esta reservación?')) {
                      onCancelReservation(res.id);
                    }
                  }}
                  className="p-2.5 text-[#8a817c] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  title="Cancelar reservación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
