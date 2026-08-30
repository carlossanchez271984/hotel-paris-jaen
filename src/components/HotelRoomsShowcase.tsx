import React from 'react';
import { ROOMS_DATA } from '../data/rooms';
import { RoomCard } from './RoomCard';
import { RoomId, Room } from '../types';
import { BedDouble, Sparkles } from 'lucide-react';

interface HotelRoomsShowcaseProps {
  onSelectAndBook: (roomId: RoomId) => void;
  rooms?: Room[];
}

export const HotelRoomsShowcase: React.FC<HotelRoomsShowcaseProps> = ({ 
  onSelectAndBook,
  rooms = ROOMS_DATA
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c5a880] bg-[#faf8f5] px-3.5 py-1.5 border border-[#e5e1da] uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          Alojamiento Distinguido
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1a1a] mt-3 tracking-wide">
          Habitaciones de Hotel París Jaén
        </h2>
        <p className="text-sm text-[#8a817c] mt-2 font-light font-editorial-sub italic">
          Todas nuestras habitaciones cuentan con los servicios necesarios para una estadía placentera, segura y relajante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isSelected={false}
            onSelect={(id) => onSelectAndBook(id)}
          />
        ))}
      </div>
    </div>
  );
};

