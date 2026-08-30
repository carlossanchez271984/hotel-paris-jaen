import React, { useState, useEffect } from 'react';
import { User, RoomId, Reservation, Room } from '../types';
import { ROOMS_DATA } from '../data/rooms';
import { RoomCard } from './RoomCard';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Moon, 
  Sun,
  AlertCircle,
  FileText,
  BedDouble
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReservationFormProps {
  user: User;
  onReservationComplete: (reservation: Reservation) => void;
  rooms?: Room[];
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  user,
  onReservationComplete,
  rooms = ROOMS_DATA,
}) => {
  // Today formatted as YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // State
  const [checkIn, setCheckIn] = useState<string>(getTodayString());
  const [checkOut, setCheckOut] = useState<string>(getTomorrowString());
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>('matrimonial');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [guestName, setGuestName] = useState<string>(user.name || '');
  const [guestEmail, setGuestEmail] = useState<string>(user.email || '');
  const [guestPhone, setGuestPhone] = useState<string>(user.phone || '+51 996 063 817');
  const [arrivalTime, setArrivalTime] = useState<string>('08:00');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync with user changes
  useEffect(() => {
    if (user.name) setGuestName(user.name);
    if (user.email) setGuestEmail(user.email);
    if (user.phone) setGuestPhone(user.phone);
  }, [user]);

  // Calculate days & nights
  const calculateStay = () => {
    if (!checkIn || !checkOut) return { nights: 0, days: 0, isValid: false };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      nights: diffDays > 0 ? diffDays : 0,
      days: diffDays > 0 ? diffDays : 0,
      isValid: diffDays > 0,
    };
  };

  const stayInfo = calculateStay();

  // Adjust dates helper
  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    const start = new Date(newCheckIn);
    const end = new Date(checkOut);
    if (end <= start) {
      const nextDay = new Date(start);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const applyStayPreset = (days: number) => {
    const start = new Date(checkIn || getTodayString());
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setCheckOut(end.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!stayInfo.isValid || stayInfo.nights <= 0) {
      setError('La fecha de salida debe ser posterior a la fecha de ingreso.');
      return;
    }

    if (!guestName.trim()) {
      setError('Por favor ingrese el nombre del huésped titular.');
      return;
    }

    if (!guestPhone.trim()) {
      setError('Por favor ingrese un número de teléfono o WhatsApp para confirmar la reserva.');
      return;
    }

    setIsSubmitting(true);

    const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
    const randomCode = 'HP-' + Math.floor(10000 + Math.random() * 90000);

    const newReservation: Reservation = {
      id: randomCode,
      userId: user.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      roomId: selectedRoomId,
      roomName: selectedRoom.name,
      checkIn: checkIn,
      checkOut: checkOut,
      totalNights: stayInfo.nights,
      totalDays: stayInfo.days,
      adults: adults,
      children: children,
      specialRequests: specialRequests.trim(),
      arrivalTime: arrivalTime,
      createdAt: new Date().toISOString(),
      status: 'confirmada',
    };

    setTimeout(() => {
      // Trigger festive celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch (err) {
        console.log('Confetti effect');
      }

      setIsSubmitting(false);
      onReservationComplete(newReservation);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c5a880] bg-[#faf8f5] px-3.5 py-1.5 border border-[#e5e1da] uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          Paso a paso de tu estancia
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1a1a] mt-3 tracking-wide">
          Reserva tu Estadía en Hotel París
        </h2>
        <p className="text-sm text-[#8a817c] mt-2 font-light font-editorial-sub italic">
          Selecciona tus fechas de ingreso y salida, calcula los días de tu estadía y elige el tipo de habitación deseado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* STEP 1: CALENDAR & STAY DURATION (Requested) */}
        <div className="bg-white p-6 sm:p-8 border border-[#e5e1da] shadow-xs">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#e5e1da]">
            <div className="w-9 h-9 bg-[#faf8f5] border border-[#e5e1da] text-[#1a1a1a] flex items-center justify-center font-serif font-bold text-base">
              1
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a] flex items-center gap-2 tracking-wide">
                <span className="text-base">📅</span>
                Calendario de Ingreso y Salida
              </h3>
              <p className="text-xs text-[#8a817c]">
                Indica cuándo llegarás y cuándo finalizará tu estadía
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Check-in Input */}
            <div className="space-y-2">
              <label htmlFor="input-check-in" className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#c5a880]" />
                Fecha de Ingreso (Check-in)
              </label>
              <input
                id="input-check-in"
                type="date"
                required
                min={getTodayString()}
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] focus:bg-white p-3 text-xs font-medium text-[#1a1a1a] transition-colors outline-none"
              />
              <p className="text-[11px] text-[#8a817c]">Ingreso regular desde las 08:00 AM</p>
            </div>

            {/* Check-out Input */}
            <div className="space-y-2">
              <label htmlFor="input-check-out" className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#c5a880]" />
                Fecha de Salida (Check-out)
              </label>
              <input
                id="input-check-out"
                type="date"
                required
                min={checkIn || getTodayString()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] focus:bg-white p-3 text-xs font-medium text-[#1a1a1a] transition-colors outline-none"
              />
              <p className="text-[11px] text-[#8a817c]">Salida hasta las 12:00 PM</p>
            </div>

            {/* DURATION CALCULATOR BANNER (Explicit prompt requirement) */}
            <div className="md:col-span-2 lg:col-span-1 bg-[#faf8f5] border border-[#e5e1da] p-5 flex flex-col justify-center">
              <div className="text-[11px] font-semibold text-[#8a817c] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                Tiempo Total de Estadía
              </div>

              {stayInfo.isValid ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1a1a]">
                      {stayInfo.days}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8a817c]">
                      {stayInfo.days === 1 ? 'Día / 1 Noche' : `Días / ${stayInfo.nights} Noches`}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a4a4a] mt-1">
                    Del <strong className="font-semibold text-[#1a1a1a]">{checkIn}</strong> al <strong className="font-semibold text-[#1a1a1a]">{checkOut}</strong>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700 text-xs py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Por favor seleccione fechas válidas</span>
                </div>
              )}

              {/* Fast Presets */}
              <div className="mt-3 pt-3 border-t border-[#e5e1da] flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#8a817c] font-semibold uppercase tracking-wider">Atajos:</span>
                <button
                  type="button"
                  onClick={() => applyStayPreset(1)}
                  className="px-2.5 py-1 bg-white border border-[#e5e1da] text-[11px] font-medium text-[#1a1a1a] hover:bg-[#faf8f5] cursor-pointer"
                >
                  1 día
                </button>
                <button
                  type="button"
                  onClick={() => applyStayPreset(2)}
                  className="px-2.5 py-1 bg-white border border-[#e5e1da] text-[11px] font-medium text-[#1a1a1a] hover:bg-[#faf8f5] cursor-pointer"
                >
                  2 días
                </button>
                <button
                  type="button"
                  onClick={() => applyStayPreset(3)}
                  className="px-2.5 py-1 bg-white border border-[#e5e1da] text-[11px] font-medium text-[#1a1a1a] hover:bg-[#faf8f5] cursor-pointer"
                >
                  3 días
                </button>
                <button
                  type="button"
                  onClick={() => applyStayPreset(7)}
                  className="px-2.5 py-1 bg-white border border-[#e5e1da] text-[11px] font-medium text-[#1a1a1a] hover:bg-[#faf8f5] cursor-pointer"
                >
                  1 semana
                </button>
              </div>
            </div>

          </div>

          {/* Guest Count Selector */}
          <div className="mt-6 pt-6 border-t border-[#e5e1da] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8a817c]" />
                Adultos
              </label>
              <select
                id="select-adults"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-2.5 text-xs font-medium text-[#1a1a1a] outline-none"
              >
                <option value={1}>1 Adulto</option>
                <option value={2}>2 Adultos</option>
                <option value={3}>3 Adultos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8a817c]" />
                Niños (Opcional)
              </label>
              <select
                id="select-children"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-2.5 text-xs font-medium text-[#1a1a1a] outline-none"
              >
                <option value={0}>0 Niños</option>
                <option value={1}>1 Niño</option>
                <option value={2}>2 Niños</option>
                <option value={3}>3 Niños</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8a817c]" />
                Hora aprox. de llegada
              </label>
              <select
                id="select-arrival-time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-2.5 text-xs font-medium text-[#1a1a1a] outline-none"
              >
                <option value="00:00">00:00 AM (Medianoche)</option>
                <option value="01:00">01:00 AM</option>
                <option value="02:00">02:00 AM</option>
                <option value="03:00">03:00 AM</option>
                <option value="04:00">04:00 AM</option>
                <option value="05:00">05:00 AM</option>
                <option value="06:00">06:00 AM</option>
                <option value="07:00">07:00 AM</option>
                <option value="08:00">08:00 AM (Check-in estándar)</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM (Mediodía)</option>
                <option value="13:00">13:00 PM</option>
                <option value="14:00">14:00 PM</option>
                <option value="15:00">15:00 PM</option>
                <option value="16:00">16:00 PM</option>
                <option value="17:00">17:00 PM</option>
                <option value="18:00">18:00 PM</option>
                <option value="19:00">19:00 PM</option>
                <option value="20:00">20:00 PM</option>
                <option value="21:00">21:00 PM</option>
                <option value="22:00">22:00 PM</option>
                <option value="23:00">23:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2: ROOM SELECTION WITHOUT PRICE (Explicit prompt requirement) */}
        <div className="bg-white p-6 sm:p-8 border border-[#e5e1da] shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e1da] flex-wrap gap-2">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-[#faf8f5] border border-[#e5e1da] text-[#1a1a1a] flex items-center justify-center font-serif font-bold text-base">
                2
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1a1a1a] flex items-center gap-2 tracking-wide">
                  <BedDouble className="w-4 h-4 text-[#c5a880]" />
                  Elige tu Habitación (Cama Matrimonial o Cama Doble)
                </h3>
                <p className="text-xs text-[#8a817c]">
                  Selecciona la opción perfecta para tu estancia en Hotel París Jaén
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-[#4a4a4a] bg-[#faf8f5] px-3 py-1.5 border border-[#e5e1da]">
              Habitación seleccionada: <strong className="text-[#1a1a1a] uppercase tracking-wider">{selectedRoomId === 'matrimonial' ? 'Cama Matrimonial' : 'Cama Doble'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onSelect={(id) => setSelectedRoomId(id)}
              />
            ))}
          </div>
        </div>

        {/* STEP 3: GUEST DETAILS & CONFIRMATION */}
        <div className="bg-white p-6 sm:p-8 border border-[#e5e1da] shadow-xs">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#e5e1da]">
            <div className="w-9 h-9 bg-[#faf8f5] border border-[#e5e1da] text-[#1a1a1a] flex items-center justify-center font-serif font-bold text-base">
              3
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a] flex items-center gap-2 tracking-wide">
                <UserCheck className="w-4 h-4 text-[#c5a880]" />
                Datos del Huésped Titular
              </h3>
              <p className="text-xs text-[#8a817c]">
                La reservación se registrará a nombre del titular
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5">
                Nombre Completo *
              </label>
              <input
                id="input-guest-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nombre del huésped"
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-3 text-xs font-medium text-[#1a1a1a] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5">
                Correo Electrónico *
              </label>
              <input
                id="input-guest-email"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-3 text-xs font-medium text-[#1a1a1a] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5">
                Teléfono / WhatsApp de Contacto *
              </label>
              <input
                id="input-guest-phone"
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+51 999 000 000"
                className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-3 text-xs font-medium text-[#1a1a1a] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4a4a4a] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8a817c]" />
              Solicitudes Especiales / Comentarios (Opcional)
            </label>
            <textarea
              id="textarea-special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              placeholder="Ej. Cama con almohadas extra, estacionamiento, llegada en la madrugada..."
              className="w-full bg-[#faf8f5] border border-[#e5e1da] focus:border-[#1a1a1a] p-3 text-xs font-normal text-[#1a1a1a] outline-none resize-none"
            />
          </div>

          {error && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission Action */}
          <div className="mt-8 pt-6 border-t border-[#e5e1da] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#8a817c] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0" />
              <span>Confirmación inmediata y atención personalizada por WhatsApp</span>
            </div>

            <button
              id="btn-confirm-reservation"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#fdfbf7] font-semibold text-xs uppercase tracking-widest px-8 py-4 border border-[#1a1a1a] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />
                  <span>Confirmar Reservación en Hotel París Jaén</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};
