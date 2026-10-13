import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import type { UserRole, User } from '../store/shop';

export interface FirebaseUserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  deliveryBoyId?: string;
  phone?: string;
  vehicle?: string;
  vehicleNumber?: string;
  zone?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
  [key: string]: unknown;
}

/**
 * Fetch user profile from Firestore or create a default customer profile
 */
export async function getOrCreateFirestoreProfile(
  fbUser: FirebaseUser,
  fallbackRole: UserRole = 'customer'
): Promise<FirebaseUserProfile> {
  if (!db) {
    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      role: fallbackRole,
    };
  }

  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = (snap.data() as unknown) as FirebaseUserProfile;
    return {
      ...data,
      uid: fbUser.uid,
      email: fbUser.email || data.email,
      name: fbUser.displayName || data.name,
      role: data.role || fallbackRole,
    };
  }

  // Determine role based on email pattern or requested role
  let role = fallbackRole;
  if (fbUser.email?.toLowerCase().includes('admin')) {
    role = 'admin';
  } else if (fbUser.email?.toLowerCase().includes('delivery')) {
    role = 'delivery';
  }

  const newProfile: FirebaseUserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    role,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

/**
 * Sign in using Firebase Email & Password
 */
export async function firebaseLoginWithEmail(email: string, pass: string): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials in .env.');
  }

  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const profile = await getOrCreateFirestoreProfile(cred.user);

  return {
    email: profile.email,
    name: profile.name,
    role: profile.role,
    deliveryBoyId: profile.deliveryBoyId,
  };
}

/**
 * Register a new user with Firebase Auth and save role in Firestore
 */
export async function firebaseRegisterWithEmail(params: {
  email: string;
  pass: string;
  name: string;
  role: UserRole;
  phone?: string;
  vehicle?: string;
  vehicleNumber?: string;
  zone?: string;
  deliveryBoyId?: string;
}): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials in .env.');
  }

  const cred = await createUserWithEmailAndPassword(auth, params.email.trim(), params.pass);
  await updateProfile(cred.user, { displayName: params.name.trim() });

  const profile: FirebaseUserProfile = {
    uid: cred.user.uid,
    email: params.email.trim().toLowerCase(),
    name: params.name.trim(),
    role: params.role,
    phone: params.phone?.trim(),
    vehicle: params.vehicle?.trim(),
    vehicleNumber: params.vehicleNumber?.trim(),
    zone: params.zone?.trim(),
    deliveryBoyId: params.deliveryBoyId,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (db) {
    await setDoc(doc(db, 'users', cred.user.uid), profile);
  }

  return {
    email: profile.email,
    name: profile.name,
    role: profile.role,
    deliveryBoyId: profile.deliveryBoyId,
  };
}

/**
 * Sign in with Google Popup
 */
export async function firebaseSignInWithGoogle(roleOverride?: UserRole): Promise<User> {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase Google Authentication is not configured. Please check your credentials in .env.');
  }

  const cred = await signInWithPopup(auth, googleProvider);
  const profile = await getOrCreateFirestoreProfile(cred.user, roleOverride || 'customer');

  return {
    email: profile.email,
    name: profile.name,
    role: profile.role,
    deliveryBoyId: profile.deliveryBoyId,
  };
}

/**
 * Sign out from Firebase
 */
export async function firebaseSignOut(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Subscribe to auth state changes and sync with Zustand store
 */
export function subscribeToFirebaseAuth(onUserChanged: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      onUserChanged(null);
      return;
    }

    try {
      const profile = await getOrCreateFirestoreProfile(fbUser);
      onUserChanged({
        email: profile.email,
        name: profile.name,
        role: profile.role,
        deliveryBoyId: profile.deliveryBoyId,
      });
    } catch (err) {
      console.error('Error fetching Firestore user profile on auth change:', err);
      onUserChanged({
        email: fbUser.email || '',
        name: fbUser.displayName || 'User',
        role: 'customer',
      });
    }
  });
}

