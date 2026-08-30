import React from 'react';
import { Sparkles, MapPin, Wifi, Shield, Star, Clock, Phone } from 'lucide-react';
import { HOTEL_CONTACT } from '../data/rooms';

interface BannerProps {
  onStartBooking?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onStartBooking }) => {
  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] text-[#fdfbf7] border-b border-[#e5e1da]">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Tag & Rating */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30">
              <Sparkles className="w-3 h-3 text-[#c5a880]" />
              Hospitalidad &middot; Exclusividad
            </span>
            <div className="flex items-center gap-1.5 text-[#c5a880] text-xs px-2.5 py-1 border border-[#e5e1da]/20 bg-[#1a1a1a]/60">
              <div className="flex">
                {[...Array(2)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#c5a880] text-[#c5a880]" />
                ))}
              </div>
              <span className="ml-1 text-[#e5e1da] text-[11px] tracking-wide">Servicio distinguido</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-[0.12em] text-[#fdfbf7] uppercase leading-tight text-center">
            Hotel París Jaén
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-[#e5e1da]/90 leading-relaxed font-light font-editorial-sub italic max-w-2xl text-center">
            Bienvenido al sistema de reservaciones oficial de <strong className="text-[#fdfbf7] font-semibold not-italic">Hotel París Jaén</strong>. Selecciona tus fechas de ingreso y salida, elige entre nuestras habitaciones <span className="text-[#c5a880] not-italic font-medium">Cama Matrimonial</span> o <span className="text-[#c5a880] not-italic font-medium">Cama Doble</span>, y asegura tu descanso.
          </p>

          {/* Key Hotel Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
            <div className="bg-[#242424]/90 border border-[#e5e1da]/20 p-3">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-1">
                <Wifi className="w-3.5 h-3.5" />
                <span>Wifi + Cable</span>
              </div>
              <p className="text-[11px] text-[#e5e1da]/70">Gratis en habitaciones</p>
            </div>

            <div className="bg-[#242424]/90 border border-[#e5e1da]/20 p-3">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Baño Privado</span>
              </div>
              <p className="text-[11px] text-[#e5e1da]/70">Con ducha incluida</p>
            </div>

            <div className="bg-[#242424]/90 border border-[#e5e1da]/20 p-3">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Atención 24/7</span>
              </div>
              <p className="text-[11px] text-[#e5e1da]/70">Recepción permanente</p>
            </div>

            <div className="bg-[#242424]/90 border border-[#e5e1da]/20 p-3">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </div>
              <p className="text-[11px] text-[#e5e1da]/70">{HOTEL_CONTACT.phoneFormatted}</p>
            </div>
          </div>

          {/* Location Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#e5e1da]/70 uppercase tracking-widest text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{HOTEL_CONTACT.address}</span>
          </div>

        </div>
      </div>
    </section>
  );
};
