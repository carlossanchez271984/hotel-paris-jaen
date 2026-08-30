import React from 'react';
import { User } from '../types';
import { LogOut, CalendarCheck, BedDouble, Shield } from 'lucide-react';
import hotelParisLogo from '../assets/images/gold_eiffel_icon_1787892659563.jpg';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: 'reservar' | 'mis-reservas' | 'habitaciones' | 'admin';
  setActiveTab: (tab: 'reservar' | 'mis-reservas' | 'habitaciones' | 'admin') => void;
  reservationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab,
  reservationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e1da] text-[#1a1a1a] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Hotel Brand */}
          <div 
            onClick={() => setActiveTab('reservar')}
            className="flex items-center gap-3.5 cursor-pointer"
          >
            <div className="w-12 h-12 border border-[#e5e1da] bg-white flex items-center justify-center overflow-hidden p-1 shadow-xs rounded-sm">
              <img
                src={hotelParisLogo}
                alt="Hotel París Jaén Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="block text-2xl font-serif tracking-[0.18em] text-[#1a1a1a] uppercase leading-none font-bold">
                Hotel París
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#8a817c] uppercase font-medium mt-1 block">
                Élégance &middot; Jaén, Perú
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 bg-[#faf8f5] p-1.5 border border-[#e5e1da]">
            <button
              id="nav-tab-reservar"
              onClick={() => setActiveTab('reservar')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'reservar'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-white'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Hacer Reservación</span>
            </button>

            <button
              id="nav-tab-habitaciones"
              onClick={() => setActiveTab('habitaciones')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'habitaciones'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-white'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Habitaciones</span>
            </button>

            <button
              id="nav-tab-mis-reservas"
              onClick={() => setActiveTab('mis-reservas')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'mis-reservas'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-white'
              }`}
            >
              <span>Mis Reservas</span>
              {reservationsCount > 0 && (
                <span className="w-4 h-4 bg-[#c5a880] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {reservationsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#c5a880] text-white shadow-xs'
                  : 'text-[#8a817c] hover:text-[#1a1a1a] hover:bg-white'
              }`}
              title="Administración"
            >
              <Shield className="w-3.5 h-3.5 text-[#c5a880] group-hover:text-[#1a1a1a]" />
              <span>Admin</span>
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* User Pill */}
            <div className="flex items-center gap-2.5 bg-[#faf8f5] border border-[#e5e1da] py-1.5 pl-2 pr-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 object-cover border border-[#e5e1da]"
                />
              ) : (
                <div className="w-7 h-7 bg-[#1a1a1a] text-[#fdfbf7] flex items-center justify-center text-xs font-serif font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1a1a1a] leading-tight max-w-[120px] truncate">
                  {user.name}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-[#8a817c] leading-none">
                  {user.provider === 'google' ? 'Google' : 'Huésped'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="btn-logout"
              onClick={onLogout}
              className="p-2 text-[#8a817c] hover:text-[#1a1a1a] hover:bg-[#faf8f5] border border-transparent hover:border-[#e5e1da] transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#e5e1da] text-xs">
          <button
            onClick={() => setActiveTab('reservar')}
            className={`py-1.5 px-2.5 uppercase tracking-wider text-[10px] flex items-center gap-1 ${
              activeTab === 'reservar' ? 'bg-[#1a1a1a] text-white font-bold' : 'text-[#8a817c]'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Reservar</span>
          </button>
          <button
            onClick={() => setActiveTab('habitaciones')}
            className={`py-1.5 px-2.5 uppercase tracking-wider text-[10px] flex items-center gap-1 ${
              activeTab === 'habitaciones' ? 'bg-[#1a1a1a] text-white font-bold' : 'text-[#8a817c]'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Habitaciones</span>
          </button>
          <button
            onClick={() => setActiveTab('mis-reservas')}
            className={`py-1.5 px-2.5 uppercase tracking-wider text-[10px] flex items-center gap-1 relative ${
              activeTab === 'mis-reservas' ? 'bg-[#1a1a1a] text-white font-bold' : 'text-[#8a817c]'
            }`}
          >
            <span>Mis Reservas</span>
            {reservationsCount > 0 && (
              <span className="w-3.5 h-3.5 bg-[#c5a880] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {reservationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1.5 px-2.5 uppercase tracking-wider text-[10px] flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-[#c5a880] text-white font-bold' : 'text-[#c5a880]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};

