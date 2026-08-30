import React, { useState, useRef } from 'react';
import { Room, Reservation, RoomId } from '../types';
import { ROOMS_DATA, HOTEL_CONTACT } from '../data/rooms';
import { 
  Shield, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  BedDouble, 
  Users, 
  Phone, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  rooms: Room[];
  onUpdateRooms: (updatedRooms: Room[]) => void;
  reservations: Reservation[];
  onUpdateReservationStatus: (id: string, newStatus: Reservation['status']) => void;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  rooms,
  onUpdateRooms,
  reservations,
  onUpdateReservationStatus,
  onExitAdmin,
}) => {
  // Access control state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hotel_paris_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Admin Subtab
  const [adminTab, setAdminTab] = useState<'imagenes-habitaciones' | 'reservas' | 'contacto'>('imagenes-habitaciones');

  // Selected Room for Editing
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>('matrimonial');

  // Working copy of rooms for editing
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [newAmenityInput, setNewAmenityInput] = useState<string>('');

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Reservations search & filter
  const [reservationSearch, setReservationSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'confirmada' | 'completada'>('todos');

  // Current editing room
  const currentRoom = localRooms.find(r => r.id === selectedRoomId) || localRooms[0];

  // Handle PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'paris2026' || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('hotel_paris_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('PIN incorrecto. Ingrese el código de acceso autorizado.');
    }
  };

  const handleQuickAccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('hotel_paris_admin_auth', 'true');
  };

  // Handle Main Image Upload (File to Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB para un rendimiento óptimo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateRoomField(selectedRoomId, 'image', result);
        showSaveToast('Nueva imagen cargada. Presione "Guardar Cambios" para confirmar.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Gallery Image Upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updatedGallery = [...(currentRoom.gallery || []), result];
        updateRoomField(selectedRoomId, 'gallery', updatedGallery);
        showSaveToast('Foto agregada a la galería de la habitación.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add image by direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    updateRoomField(selectedRoomId, 'image', imageUrlInput.trim());
    setImageUrlInput('');
    showSaveToast('URL de imagen aplicada. Presione "Guardar Cambios".');
  };

  // Restore Default Original Image
  const handleRestoreDefaultImage = () => {
    const defaultRoom = ROOMS_DATA.find(r => r.id === selectedRoomId);
    if (defaultRoom) {
      updateRoomField(selectedRoomId, 'image', defaultRoom.image);
      updateRoomField(selectedRoomId, 'gallery', defaultRoom.gallery);
      showSaveToast('Se restauró la imagen original de fábrica.');
    }
  };

  // Generic room field updater
  const updateRoomField = (roomId: RoomId, field: keyof Room, value: any) => {
    setLocalRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  // Amenity handlers
  const handleAddAmenity = () => {
    if (!newAmenityInput.trim()) return;
    const updatedAmenities = [...currentRoom.amenities, newAmenityInput.trim()];
    updateRoomField(selectedRoomId, 'amenities', updatedAmenities);
    setNewAmenityInput('');
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    const updatedAmenities = currentRoom.amenities.filter((_, idx) => idx !== indexToRemove);
    updateRoomField(selectedRoomId, 'amenities', updatedAmenities);
  };

  // Remove gallery photo
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updatedGallery = currentRoom.gallery.filter((_, idx) => idx !== indexToRemove);
    updateRoomField(selectedRoomId, 'gallery', updatedGallery);
  };

  // Save all rooms changes to App state + localStorage + Firestore
  const handleSaveAllChanges = () => {
    onUpdateRooms(localRooms);
    setSaveSuccessMsg('¡Cambios guardados con éxito! Los huéspedes verán las nuevas imágenes inmediatamente.');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4000);
  };

  const showSaveToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 3500);
  };

  // Filtered reservations for admin view
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.guestName.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      res.roomName.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      res.guestPhone.includes(reservationSearch) ||
      res.id.toLowerCase().includes(reservationSearch.toLowerCase());

    const matchesStatus = statusFilter === 'todos' ? true : res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Admin PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 py-10 bg-white border border-[#e5e1da] shadow-sm text-center">
        <div className="w-14 h-14 bg-[#1a1a1a] text-[#c5a880] mx-auto flex items-center justify-center rounded-full mb-4">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-wide">
          Administración
        </h2>
        <p className="text-xs text-[#8a817c] mt-1.5 uppercase tracking-widest">
          Hotel París Jaén &middot; Jaén, Perú
        </p>
        <p className="text-sm text-[#4a4a4a] mt-4 mb-6 leading-relaxed">
          Acceso exclusivo para la administración para actualizar imágenes de habitaciones y gestionar reservas.
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4a4a4a] mb-1.5">
              Código / PIN de Administrador
            </label>
            <div className="relative">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingrese PIN de acceso"
                className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              />
              <Lock className="w-4 h-4 text-[#8a817c] absolute right-3 top-3" />
            </div>
            {pinError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {pinError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a1a1a] text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#333] transition-colors cursor-pointer"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#e5e1da] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickAccess}
            className="text-xs text-[#c5a880] hover:text-[#1a1a1a] font-semibold flex items-center justify-center gap-1.5 cursor-pointer py-1"
          >
            <Unlock className="w-3.5 h-3.5" />
            Acceso Rápido de Administración
          </button>
          <button
            type="button"
            onClick={onExitAdmin}
            className="text-xs text-[#8a817c] hover:text-[#1a1a1a] cursor-pointer"
          >
            Volver a la web pública
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="bg-white border border-[#e5e1da] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-[#1a1a1a] text-[#c5a880] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Administración
            </span>
            <span className="text-xs text-[#8a817c]">Sistema Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] mt-1.5">
            Administración de Hotel París Jaén
          </h1>
          <p className="text-xs text-[#666] mt-1">
            Cambia las fotos de las habitaciones, edita detalles y administra las reservaciones en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAllChanges}
            className="bg-[#c5a880] hover:bg-[#b0936b] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
          <button
            onClick={onExitAdmin}
            className="border border-[#e5e1da] hover:border-[#1a1a1a] bg-[#faf8f5] text-[#1a1a1a] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#8a817c]" />
            Ver Web Pública
          </button>
        </div>
      </div>

      {/* Floating Save Toast Notification */}
      {saveSuccessMsg && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg('')}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#e5e1da] mb-8 gap-2 bg-[#faf8f5] p-1.5">
        <button
          onClick={() => setAdminTab('imagenes-habitaciones')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'imagenes-habitaciones'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'text-[#666] hover:text-[#1a1a1a] hover:bg-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Fotos y Habitaciones</span>
        </button>

        <button
          onClick={() => setAdminTab('reservas')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
            adminTab === 'reservas'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'text-[#666] hover:text-[#1a1a1a] hover:bg-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Control de Reservas</span>
          <span className="bg-[#c5a880] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
            {reservations.length}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: FOTOS Y HABITACIONES ================= */}
      {adminTab === 'imagenes-habitaciones' && (
        <div className="space-y-8">
          
          {/* Room Selector Pills */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 border border-[#e5e1da]">
            <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-[#c5a880]" />
              Selecciona la Habitación a Modificar:
            </span>
            {localRooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedRoomId === room.id
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-[#faf8f5] text-[#4a4a4a] border-[#e5e1da] hover:bg-white'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Management */}
            <div className="lg:col-span-6 bg-white border border-[#e5e1da] p-6 shadow-xs space-y-6">
              <div className="border-b border-[#e5e1da] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1a1a1a]">
                    Fotografía Principal
                  </h2>
                  <p className="text-xs text-[#8a817c]">
                    Esta es la foto que los clientes ven en la tarjeta de reserva.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreDefaultImage}
                  className="text-[11px] text-[#8a817c] hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer font-medium"
                  title="Restaurar imagen original de fábrica"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restaurar Original
                </button>
              </div>

              {/* Current Main Image Preview */}
              <div className="relative aspect-4/3 bg-[#f0ede6] overflow-hidden border border-[#e5e1da] group">
                <img
                  src={currentRoom.image}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-[#1a1a1a]/80 text-white text-[10px] uppercase tracking-wider px-2.5 py-1">
                  Vista Previa Actual
                </div>
              </div>

              {/* Image Upload Controls */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                  Cambiar Foto Principal:
                </p>

                {/* Option A: Upload from Device */}
                <div className="bg-[#faf8f5] p-4 border border-[#e5e1da]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-[#1a1a1a]">
                        Subir foto desde tu dispositivo
                      </p>
                      <p className="text-[11px] text-[#8a817c]">
                        Selecciona una foto desde tu celular o computadora (JPG, PNG).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#1a1a1a] hover:bg-[#333] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                      Elegir Archivo
                    </button>
                  </div>
                </div>

                {/* Option B: Enter image URL */}
                <div className="bg-[#faf8f5] p-4 border border-[#e5e1da] space-y-2">
                  <p className="text-xs font-semibold text-[#1a1a1a]">
                    O pegar enlace / URL de imagen web:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://ejemplo.com/mifoto.jpg"
                      className="flex-1 bg-white border border-[#e5e1da] px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-[#1a1a1a] text-white px-3 py-2 text-xs uppercase font-semibold cursor-pointer shrink-0"
                    >
                      Aplicar URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Photos section */}
              <div className="border-t border-[#e5e1da] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                    Galería de Fotos ({currentRoom.gallery?.length || 0})
                  </p>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={handleGalleryUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="text-xs text-[#c5a880] hover:text-[#1a1a1a] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir Foto a Galería
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {currentRoom.gallery?.map((img, idx) => (
                    <div key={idx} className="relative aspect-4/3 bg-[#f0ede6] border border-[#e5e1da] overflow-hidden group">
                      <img src={img} alt="Galería" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Eliminar foto de galería"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Room Details & Amenities */}
            <div className="lg:col-span-6 bg-white border border-[#e5e1da] p-6 shadow-xs space-y-5">
              <div className="border-b border-[#e5e1da] pb-3">
                <h2 className="text-lg font-serif font-bold text-[#1a1a1a]">
                  Información y Servicios de la Habitación
                </h2>
                <p className="text-xs text-[#8a817c]">
                  Personaliza los textos y servicios que verán los huéspedes.
                </p>
              </div>

              {/* Room Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1">
                  Nombre de la Habitación
                </label>
                <input
                  type="text"
                  value={currentRoom.name}
                  onChange={(e) => updateRoomField(selectedRoomId, 'name', e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1">
                  Lema / Subtítulo Corto
                </label>
                <input
                  type="text"
                  value={currentRoom.tagline}
                  onChange={(e) => updateRoomField(selectedRoomId, 'tagline', e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bed Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1">
                    Tipo de Cama
                  </label>
                  <input
                    type="text"
                    value={currentRoom.bedType}
                    onChange={(e) => updateRoomField(selectedRoomId, 'bedType', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1">
                    Capacidad
                  </label>
                  <input
                    type="text"
                    value={currentRoom.capacity}
                    onChange={(e) => updateRoomField(selectedRoomId, 'capacity', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={currentRoom.description}
                  onChange={(e) => updateRoomField(selectedRoomId, 'description', e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>

              {/* Amenities Management */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">
                  Servicios Incluidos ({currentRoom.amenities.length})
                </label>

                {/* Add new amenity */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={(e) => setNewAmenityInput(e.target.value)}
                    placeholder="Ej: Aire acondicionado, Frigobar..."
                    className="flex-1 bg-[#faf8f5] border border-[#e5e1da] px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="bg-[#1a1a1a] text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Añadir
                  </button>
                </div>

                {/* Current Amenities List */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-[#faf8f5] border border-[#e5e1da]">
                  {currentRoom.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-white border border-[#e5e1da] text-xs text-[#1a1a1a] px-2.5 py-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#c5a880]" />
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="text-red-500 hover:text-red-700 ml-1 cursor-pointer font-bold"
                        title="Quitar servicio"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Big Save Button */}
              <div className="pt-4 border-t border-[#e5e1da]">
                <button
                  type="button"
                  onClick={handleSaveAllChanges}
                  className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4 text-[#c5a880]" />
                  Guardar Todos los Cambios en la Web
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 2: CONTROL DE RESERVAS ================= */}
      {adminTab === 'reservas' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5e1da] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-72">
              <input
                type="text"
                value={reservationSearch}
                onChange={(e) => setReservationSearch(e.target.value)}
                placeholder="Buscar por huésped, teléfono o ID..."
                className="w-full bg-[#faf8f5] border border-[#e5e1da] px-3.5 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs text-[#8a817c] uppercase font-bold shrink-0">Filtrar:</span>
              {(['todos', 'pendiente', 'confirmada', 'completada'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                      : 'bg-[#faf8f5] text-[#4a4a4a] border-[#e5e1da]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="bg-white border border-[#e5e1da] p-12 text-center text-[#8a817c]">
              <Calendar className="w-10 h-10 mx-auto text-[#c5a880] mb-3 opacity-60" />
              <p className="text-sm font-serif">No se encontraron reservas con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReservations.map(res => (
                <div key={res.id} className="bg-white border border-[#e5e1da] p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e5e1da] pb-2.5">
                      <span className="text-[10px] font-mono text-[#8a817c]">
                        ID: {res.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        res.status === 'confirmada' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : res.status === 'completada'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
                        {res.guestName}
                      </h3>
                      <p className="text-xs text-[#c5a880] font-semibold">
                        {res.roomName}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-[#4a4a4a] bg-[#faf8f5] p-3 border border-[#e5e1da]">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#8a817c]" />
                        <span>{res.checkIn} al {res.checkOut} ({res.totalNights} noches)</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#8a817c]" />
                        <span>{res.adults} adultos {res.children > 0 && `+ ${res.children} niños`}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#8a817c]" />
                        <span>{res.guestPhone}</span>
                      </p>
                      {res.specialRequests && (
                        <p className="text-[11px] text-[#666] italic mt-1 pt-1 border-t border-[#e5e1da]">
                          "{res.specialRequests}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5e1da] flex flex-col gap-2">
                    {/* Direct WhatsApp Contact button */}
                    <a
                      href={`https://wa.me/${res.guestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola ${res.guestName}, le saludamos de Hotel París Jaén respecto a su reservación ${res.id} para la ${res.roomName} del ${res.checkIn} al ${res.checkOut}. ¿Cómo podemos asistirle?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contactar por WhatsApp
                    </a>

                    {/* Status switcher */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-[#8a817c] font-semibold">Estado:</span>
                      <select
                        value={res.status}
                        onChange={(e) => onUpdateReservationStatus(res.id, e.target.value as Reservation['status'])}
                        className="flex-1 bg-[#faf8f5] border border-[#e5e1da] text-xs text-[#1a1a1a] px-2 py-1 focus:outline-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
