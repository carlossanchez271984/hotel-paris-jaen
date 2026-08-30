import { Room } from '../types';
import matrimonialImg from '../assets/images/matrimonial_real_1787879336565.jpg';
import dobleImg from '../assets/images/hotel_doble_real_original_1787978752017.jpg';

export const ROOMS_DATA: Room[] = [
  {
    id: 'matrimonial',
    name: 'Habitación Cama Matrimonial',
    tagline: 'Ideal para parejas o descanso individual de primer nivel',
    bedType: '1 Cama Matrimonial Confortable',
    capacity: 'Hasta 2 personas',
    image: matrimonialImg,
    gallery: [matrimonialImg],
    description: 'Espaciosa habitación con cama matrimonial, diseñada para brindar máxima comodidad y tranquilidad durante su estadía en Hotel París Jaén.',
    amenities: [
      'Tv',
      'Ventilador',
      'Cable + wifi gratis',
      'Ropero',
      'Mesa + 2 sillas',
      'Ducha privada',
      'Baño privado'
    ]
  },
  {
    id: 'doble',
    name: 'Habitación Cama Doble',
    tagline: 'Perfecta para amigos, colegas o familiares que viajan juntos',
    bedType: '2 Camas Confortables (Cama Doble)',
    capacity: 'Hasta 2-3 personas',
    image: dobleImg,
    gallery: [dobleImg],
    description: 'Habitación equipada con dos camas cómodas, excelente ventilación e iluminación natural, garantizando una estadía placentera y relajante.',
    amenities: [
      'Tv',
      'Ventilador',
      'Cable + wifi gratis',
      'Ropero',
      'Mesa + 2 sillas',
      'Ducha privada',
      'Baño privado'
    ]
  }
];

export const HOTEL_CONTACT = {
  name: 'Hotel París Jaén',
  phoneFormatted: '+51 996 063 817',
  whatsappNumber: '51996063817',
  defaultWhatsAppMessage: 'Hola, necesitas más información',
  email: 'htelparisjaen@gmail.com',
  address: 'Jaén, Cajamarca - Perú',
  checkInTime: '08:00 AM',
  checkOutTime: '12:00 PM',
};
