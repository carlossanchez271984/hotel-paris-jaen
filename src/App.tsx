import React, { useState, useEffect } from 'react';
import { User, Reservation, RoomId, Room } from './types';
import { ROOMS_DATA } from './data/rooms';
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { ReservationForm } from './components/ReservationForm';
import { HotelRoomsShowcase } from './components/HotelRoomsShowcase';
import { MyReservationsList } from './components/MyReservationsList';
import { AdminPanel } from './components/AdminPanel';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { 
  auth, 
  mapFirebaseUser, 
  saveReservationToFirestore, 
  fetchUserReservations,
  fetchAllReservationsFromFirestore,
  updateReservationStatusInFirestore,
  saveRoomsConfigToFirestore,
  fetchRoomsConfigFromFirestore,
  trackAnalyticsEvent
} from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'reservar' | 'habitaciones' | 'mis-reservas' | 'admin'>('reservar');
  const [rooms, setRooms] = useState<Room[]>(ROOMS_DATA);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [allAdminReservations, setAllAdminReservations] = useState<Reservation[]>([]);
  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage and Firebase Auth
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hotel_paris_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      // Load saved custom rooms configuration (photos & details)
      const storedRooms = localStorage.getItem('hotel_paris_rooms_data');
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      }

      const storedReservations = localStorage.getItem('hotel_paris_reservations');
      if (storedReservations) {
        const parsed = JSON.parse(storedReservations);
        setReservations(parsed);
        setAllAdminReservations(parsed);
      }
    } catch (e) {
      console.error('Error loading stored data', e);
    } finally {
      setIsLoaded(true);
    }

    // Try loading custom rooms data from Firestore
    fetchRoomsConfigFromFirestore().then((cloudRooms) => {
      if (cloudRooms && cloudRooms.length > 0) {
        setRooms(cloudRooms);
        localStorage.setItem('hotel_paris_rooms_data', JSON.stringify(cloudRooms));
      }
    });

    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const appUser = mapFirebaseUser(fbUser);
        setCurrentUser(appUser);
        localStorage.setItem('hotel_paris_user', JSON.stringify(appUser));
        
        // Sync user's reservations from cloud
        const cloudReservations = await fetchUserReservations(appUser.id);
        if (cloudReservations.length > 0) {
          setReservations(cloudReservations);
          localStorage.setItem('hotel_paris_reservations', JSON.stringify(cloudReservations));
        }

        // If logged in as hotel admin, sync all reservations from cloud
        if (fbUser.email === 'htelparisjaen@gmail.com') {
          const cloudAllRes = await fetchAllReservationsFromFirestore();
          if (cloudAllRes.length > 0) {
            setAllAdminReservations(cloudAllRes);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save reservations on update
  const handleSaveReservation = async (newReservation: Reservation) => {
    const updatedUserRes = [newReservation, ...reservations];
    const updatedAdminRes = [newReservation, ...allAdminReservations.filter(r => r.id !== newReservation.id)];
    
    setReservations(updatedUserRes);
    setAllAdminReservations(updatedAdminRes);
    localStorage.setItem('hotel_paris_reservations', JSON.stringify(updatedUserRes));
    setLastConfirmedReservation(newReservation);
    
    // Asynchronously save to Cloud Firestore
    await saveReservationToFirestore(newReservation);

    // Track Analytics booking event
    trackAnalyticsEvent('purchase', {
      transaction_id: newReservation.id,
      nights: newReservation.totalNights,
      room_id: newReservation.roomId,
      room_name: newReservation.roomName,
      adults: newReservation.adults,
      children: newReservation.children
    });
  };

  const handleCancelReservation = (id: string) => {
    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    localStorage.setItem('hotel_paris_reservations', JSON.stringify(updated));
  };

  // Admin: Update rooms data and images
  const handleUpdateRooms = async (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    localStorage.setItem('hotel_paris_rooms_data', JSON.stringify(updatedRooms));
    await saveRoomsConfigToFirestore(updatedRooms);
  };

  // Admin: Update reservation status
  const handleUpdateReservationStatus = async (id: string, newStatus: Reservation['status']) => {
    const updatedAdmin = allAdminReservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    const updatedUser = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    
    setAllAdminReservations(updatedAdmin);
    setReservations(updatedUser);
    localStorage.setItem('hotel_paris_reservations', JSON.stringify(updatedUser));
    await updateReservationStatusInFirestore(id, newStatus);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    localStorage.removeItem('hotel_paris_user');
    sessionStorage.removeItem('hotel_paris_admin_auth');
    setCurrentUser(null);
    setActiveTab('reservar');
  };

  const handleSelectRoomAndBook = (_roomId: RoomId) => {
    setActiveTab('reservar');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center text-[#c5a880]">
        <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, show the Auth View with Google, Login, and Register
  if (!currentUser) {
    return (
      <>
        <AuthView onLoginSuccess={(user) => setCurrentUser(user)} />
        {/* Floating WhatsApp button is always available */}
        <WhatsAppButton />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#2c2c2c] font-sans selection:bg-[#c5a880]/20 selection:text-[#1a1a1a]">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationsCount={reservations.length}
      />

      {/* Hero Banner: Hotel París Jaén (hidden in admin tab for maximum focus) */}
      {activeTab !== 'admin' && <Banner />}

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'reservar' && (
          <ReservationForm
            user={currentUser}
            rooms={rooms}
            onReservationComplete={handleSaveReservation}
          />
        )}

        {activeTab === 'habitaciones' && (
          <HotelRoomsShowcase
            rooms={rooms}
            onSelectAndBook={handleSelectRoomAndBook}
          />
        )}

        {activeTab === 'mis-reservas' && (
          <MyReservationsList
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onNewReservation={() => setActiveTab('reservar')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            rooms={rooms}
            onUpdateRooms={handleUpdateRooms}
            reservations={allAdminReservations.length > 0 ? allAdminReservations : reservations}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onExitAdmin={() => setActiveTab('reservar')}
          />
        )}
      </main>

      {/* Confirmation Modal */}
      {lastConfirmedReservation && (
        <BookingConfirmationModal
          reservation={lastConfirmedReservation}
          onClose={() => setLastConfirmedReservation(null)}
          onViewMyBookings={() => {
            setLastConfirmedReservation(null);
            setActiveTab('mis-reservas');
          }}
        />
      )}

      {/* Floating WhatsApp Button in bottom right corner */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer onOpenAdmin={() => setActiveTab('admin')} />
    </div>
  );
}

