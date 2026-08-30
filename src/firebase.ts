import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore,
  setLogLevel,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { Reservation, User, Room } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Sanitize configuration to prevent measurement ID mismatch warnings
const { measurementId, ...cleanFirebaseConfig } = firebaseConfig as Record<string, any>;

const app = !getApps().length ? initializeApp(cleanFirebaseConfig) : getApp();
export const auth = getAuth(app);

// Set Firestore log level to silent to prevent noisy background reconnect notices
try {
  setLogLevel('silent');
} catch {
  // Ignore if not supported
}

// Initialize Firestore with explicit long-polling for maximum reliability in web containers/iframes
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreDb;

// Initialize Firebase Analytics safely
let analyticsInstance: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in this environment
  });
}

// Track custom event to both Firebase Analytics & gtag
export function trackAnalyticsEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, eventParams);
    }
    // Also dispatch to global gtag if present
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  } catch {
    // Ignore tracking errors
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Convert Firebase User to App User
export function mapFirebaseUser(fbUser: FirebaseUser, additionalPhone?: string): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Huésped',
    email: fbUser.email || '',
    avatar: fbUser.photoURL || undefined,
    provider: fbUser.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email',
    phone: fbUser.phoneNumber || additionalPhone || undefined,
  };
}

// User Profile sync to Firestore
export async function syncUserProfile(user: User): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      provider: user.provider,
      phone: user.phone || null,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore user profile sync warning (falling back to local):', err);
  }
}

// Save reservation in Firestore + Local backup
export async function saveReservationToFirestore(reservation: Reservation): Promise<void> {
  try {
    const resDocRef = doc(db, 'reservations', reservation.id);
    await setDoc(resDocRef, {
      ...reservation,
      serverCreatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore reservation write warning (saved locally):', err);
  }
}

// Fetch user reservations from Firestore with local fallback
export async function fetchUserReservations(userId: string): Promise<Reservation[]> {
  try {
    if (!auth.currentUser) {
      return [];
    }
    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const reservations: Reservation[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as Reservation;
      reservations.push(data);
    });
    return reservations;
  } catch (err) {
    console.debug('Firestore reservation read notice (using local store):', err);
    return [];
  }
}

// Fetch ALL reservations for Owner / Admin panel
export async function fetchAllReservationsFromFirestore(): Promise<Reservation[]> {
  try {
    if (!auth.currentUser) {
      return [];
    }
    const snap = await getDocs(collection(db, 'reservations'));
    const reservations: Reservation[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as Reservation;
      reservations.push(data);
    });
    return reservations;
  } catch (err) {
    console.debug('Firestore all reservations read notice (restricted to hotel administration):', err);
    return [];
  }
}

// Update reservation status in Firestore
export async function updateReservationStatusInFirestore(
  reservationId: string, 
  status: Reservation['status']
): Promise<void> {
  try {
    const resDocRef = doc(db, 'reservations', reservationId);
    await setDoc(resDocRef, { status, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Firestore status update warning:', err);
  }
}

// Save rooms configuration and images to Firestore
export async function saveRoomsConfigToFirestore(rooms: Room[]): Promise<void> {
  try {
    const configDocRef = doc(db, 'hotel_config', 'rooms_data');
    await setDoc(configDocRef, {
      rooms,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore rooms config save warning (saved locally):', err);
  }
}

// Fetch rooms configuration from Firestore
export async function fetchRoomsConfigFromFirestore(): Promise<Room[] | null> {
  try {
    const configDocRef = doc(db, 'hotel_config', 'rooms_data');
    const docSnap = await getDoc(configDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.rooms) && data.rooms.length > 0) {
        return data.rooms as Room[];
      }
    }
    return null;
  } catch (err) {
    console.warn('Firestore rooms config fetch warning:', err);
    return null;
  }
}
