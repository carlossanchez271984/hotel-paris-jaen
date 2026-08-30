import React from 'react';
import { Room } from '../types';
import { 
  Tv, 
  Fan, 
  Wifi, 
  DoorClosed, 
  Armchair, 
  ShowerHead, 
  Bath, 
  Check, 
  ChevronRight, 
  Bed, 
  Sparkles,
  Users
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: (roomId: Room['id']) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isSelected,
  onSelect,
}) => {
  // Map each requested amenity to its icon
  const getAmenityIcon = (amenityText: string) => {
    const textLower = amenityText.toLowerCase();
    if (textLower.includes('tv')) return <Tv className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('ventilador')) return <Fan className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('wifi') || textLower.includes('cable')) return <Wifi className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('ropero')) return <DoorClosed className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('mesa') || textLower.includes('sillas')) return <Armchair className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('ducha')) return <ShowerHead className="w-3.5 h-3.5 text-[#c5a880]" />;
    if (textLower.includes('baño')) return <Bath className="w-3.5 h-3.5 text-[#c5a880]" />;
    return <Check className="w-3.5 h-3.5 text-[#c5a880]" />;
  };

  return (
    <div
      id={`room-card-${room.id}`}
      onClick={() => onSelect(room.id)}
      className={`group relative transition-all duration-300 overflow-hidden cursor-pointer flex flex-col bg-white border ${
        isSelected
          ? 'border-[#1a1a1a] shadow-md ring-1 ring-[#1a1a1a]'
          : 'border-[#e5e1da] hover:border-[#1a1a1a]/40 shadow-xs'
      }`}
    >
      {/* Selection Pill Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1 shadow-sm flex items-center gap-1.5 animate-in fade-in">
          <Check className="w-3 h-3 text-[#c5a880] stroke-[2.5]" />
          <span>Seleccionada</span>
        </div>
      )}

      {/* Single Photo Showcase (No carousel) */}
      <div className="relative h-64 w-full overflow-hidden bg-[#faf8f5]">
        <img
          src={room.image}
          alt={room.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Capacity badge */}
        <div className="absolute bottom-3 right-3 z-10 bg-[#1a1a1a]/85 px-2.5 py-1 text-[#fdfbf7] text-[10px] uppercase tracking-wider font-medium flex items-center gap-1 border border-[#e5e1da]/20 shadow-xs">
          <Users className="w-3 h-3 text-[#c5a880]" />
          <span>{room.capacity}</span>
        </div>
      </div>

      {/* Room Details Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8a817c] font-medium mb-1">
                <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{room.bedType}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] tracking-wide group-hover:text-[#c5a880] transition-colors">
                {room.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#4a4a4a] mb-4 leading-relaxed line-clamp-2 font-editorial-sub italic">
            {room.description}
          </p>

          {/* Amenities Grid (Exactly as requested) */}
          <div className="border-t border-[#e5e1da] pt-4 mb-4">
            <h4 className="text-[11px] font-semibold text-[#8a817c] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Contenido de la habitación</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {room.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs text-[#1a1a1a] bg-[#faf8f5] border border-[#e5e1da] px-2.5 py-2"
                >
                  <div className="p-1 bg-white border border-[#e5e1da]/60">
                    {getAmenityIcon(amenity)}
                  </div>
                  <span className="font-normal text-xs">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button without price */}
        <div className="pt-2">
          <button
            type="button"
            id={`btn-select-room-${room.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(room.id);
            }}
            className={`w-full py-3 px-4 uppercase tracking-widest font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#1a1a1a] text-white shadow-xs'
                : 'bg-white hover:bg-[#faf8f5] text-[#1a1a1a] border border-[#e5e1da]'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#c5a880] stroke-[2.5]" />
                <span>Habitación Seleccionada</span>
              </>
            ) : (
              <>
                <span>Elegir esta Habitación</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8a817c]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
