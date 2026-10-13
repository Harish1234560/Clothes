declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, unknown>;
  }
  export function initializeApp(config: Record<string, unknown>): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(): FirebaseApp;
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
  }
  export interface UserCredential {
    user: User;
  }
  export interface Auth {
    currentUser: User | null;
  }
  export class GoogleAuthProvider {
    setCustomParameters(customOAuthParameters: Record<string, string>): void;
  }
  export const browserLocalPersistence: unknown;
  export function getAuth(app?: unknown): Auth;
  export function setPersistence(auth: Auth, persistence: unknown): Promise<void>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<UserCredential>;
  export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function updateProfile(user: User, profile: { displayName?: string; photoURL?: string }): Promise<void>;
  export function onAuthStateChanged(auth: Auth, observer: (user: User | null) => void): () => void;
}

declare module 'firebase/firestore' {
  export interface Firestore {
    type?: string;
  }
  export interface DocumentReference {
    id: string;
    path: string;
  }
  export interface CollectionReference {
    id: string;
    path: string;
  }
  export interface DocumentSnapshot {
    id: string;
    exists(): boolean;
    data(): Record<string, unknown> | undefined;
  }
  export interface QuerySnapshot {
    forEach(callback: (doc: DocumentSnapshot) => void): void;
  }
  export function getFirestore(app?: unknown): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function getDoc(reference: DocumentReference): Promise<DocumentSnapshot>;
  export function getDocs(reference: CollectionReference): Promise<QuerySnapshot>;
  export function setDoc(reference: DocumentReference, data: Record<string, unknown>, options?: { merge?: boolean }): Promise<void>;
  export function updateDoc(reference: DocumentReference, data: Record<string, unknown>): Promise<void>;
  export function onSnapshot(
    reference: CollectionReference | DocumentReference,
    onNext: (snapshot: QuerySnapshot) => void,
    onError?: (error: unknown) => void
  ): () => void;
  export function serverTimestamp(): unknown;
}

