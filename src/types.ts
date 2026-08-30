export type RoomId = 'matrimonial' | 'doble';

export interface RoomAmenity {
  id: string;
  name: string;
  iconName: string;
  description?: string;
}

export interface Room {
  id: RoomId;
  name: string;
  tagline: string;
  bedType: string;
  capacity: string;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
  phone?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: RoomId;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalDays: number;
  adults: number;
  children: number;
  specialRequests?: string;
  arrivalTime?: string;
  createdAt: string;
  status: 'confirmada' | 'pendiente' | 'completada';
}
