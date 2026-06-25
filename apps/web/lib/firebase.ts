import { initializeApp, getApps, cert, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

// Cached instances
let _app: App | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _storage: Storage | null = null;

// Initialize Firebase Admin SDK (lazy initialization)
function getFirebaseAdmin(): App {
  if (_app) return _app;

  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  // For local development with emulator
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    _app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-lkk-website',
    });
    return _app;
  }

  // Check if explicit service account credentials are provided
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    // Use explicit service account credentials
    _app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    return _app;
  }

  // Use Application Default Credentials (ADC)
  // This works automatically on Firebase App Hosting, Cloud Run, etc.
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;

  try {
    _app = initializeApp({
      credential: applicationDefault(),
      projectId,
      storageBucket: projectId ? `${projectId}.appspot.com` : undefined,
    });
  } catch (error) {
    // Fallback: initialize without explicit credential (for environments that auto-inject)
    console.warn('Failed to use applicationDefault(), falling back to basic init:', error);
    _app = initializeApp({
      projectId,
      storageBucket: projectId ? `${projectId}.appspot.com` : undefined,
    });
  }

  return _app;
}

// Lazy getter for Firestore
const dbProxy = {
  get collection() {
    if (!_db) {
      const app = getFirebaseAdmin();
      _db = getFirestore(app);
    }
    return _db.collection.bind(_db);
  },
  get doc() {
    if (!_db) {
      const app = getFirebaseAdmin();
      _db = getFirestore(app);
    }
    return _db.doc.bind(_db);
  },
  get batch() {
    if (!_db) {
      const app = getFirebaseAdmin();
      _db = getFirestore(app);
    }
    return _db.batch.bind(_db);
  },
  get runTransaction() {
    if (!_db) {
      const app = getFirebaseAdmin();
      _db = getFirestore(app);
    }
    return _db.runTransaction.bind(_db);
  },
};

// Get Auth instance (lazy)
function getAdminAuthInstance(): Auth {
  if (!_auth) {
    const app = getFirebaseAdmin();
    _auth = getAuth(app);
  }
  return _auth;
}

// Get Storage instance (lazy)
function getAdminStorageInstance(): Storage {
  if (!_storage) {
    const app = getFirebaseAdmin();
    _storage = getStorage(app);
  }
  return _storage;
}

// Convenience exports - use proxy for lazy initialization
export const db = dbProxy as unknown as Firestore;
export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    const auth = getAdminAuthInstance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (auth as any)[prop as string];
    return typeof value === 'function' ? value.bind(auth) : value;
  },
});
export const adminStorage = new Proxy({} as Storage, {
  get(_, prop) {
    const storage = getAdminStorageInstance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (storage as any)[prop as string];
    return typeof value === 'function' ? value.bind(storage) : value;
  },
});

// Re-export Timestamp for convenience
export { Timestamp };

// Helper types for Firestore documents
export interface FirestoreDoc {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StoreDoc extends FirestoreDoc {
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  googleMapUrl?: string;
  businessHours?: string;
  transportation?: string;
  images: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface CoachDoc extends FirestoreDoc {
  name: string;
  slug: string;
  photo?: string;
  roleTitle?: string;
  storeId?: string;
  specialties: string[];
  certifications: string[];
  experiences: string[];
  education: string[];
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LeadDoc extends FirestoreDoc {
  type: 'booking' | 'franchise' | 'cooperation';
  name: string;
  phone: string;
  email?: string;
  storeId?: string;
  sourcePage: string;
  sourceChannel?: string;
  message?: string;
  payload: Record<string, unknown>;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  internalNote?: string;
}

export interface FaqDoc extends FirestoreDoc {
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface UserDoc extends FirestoreDoc {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'store_staff';
  storeId?: string;
  isActive: boolean;
}

// Helper function to convert Firestore doc to plain object
export function docToObject<T extends FirestoreDoc>(
  doc: FirebaseFirestore.DocumentSnapshot
): T | null {
  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
  } as T;
}

// Helper function to convert Firestore docs to array
export function docsToArray<T extends FirestoreDoc>(
  snapshot: FirebaseFirestore.QuerySnapshot
): T[] {
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}
