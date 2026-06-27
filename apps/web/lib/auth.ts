import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db, adminAuth, UserDoc, docToObject } from './firebase';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const COOKIE_NAME = 'lkk-admin-token';

export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'store_staff';
  storeId?: string;
};

// Create JWT token for session
export async function createToken(user: UserSession): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as UserSession;
  } catch {
    return null;
  }
}

// Get session from cookie
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Verify Firebase ID token and get user from Firestore
export async function verifyFirebaseToken(idToken: string): Promise<UserSession | null> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = docToObject<UserDoc>(userDoc);

    if (!userData || !userData.isActive) {
      return null;
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      storeId: userData.storeId,
    };
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}

// Fallback test user for development (only used when Firestore is unavailable)
const DEV_TEST_USER = {
  email: 'admin@l-kk.tw',
  password: 'admin123',
  user: {
    id: 'dev-admin',
    email: 'admin@l-kk.tw',
    name: '開發測試管理員',
    role: 'admin' as const,
  },
};

// Login with email and password (using Firestore for user lookup)
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserSession; error?: string }> {
  try {
    // Get user from Firestore
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      // In development, allow fallback test user
      if (process.env.NODE_ENV === 'development' || !process.env.FIREBASE_PROJECT_ID) {
        if (email === DEV_TEST_USER.email && password === DEV_TEST_USER.password) {
          console.log('Using development fallback user (Firestore user not found)');
          return { success: true, user: DEV_TEST_USER.user };
        }
      }
      return { success: false, error: '帳號或密碼錯誤' };
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Check password using bcrypt
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, userData.passwordHash || '');

    if (!isValidPassword) {
      return { success: false, error: '帳號或密碼錯誤' };
    }

    const user: UserSession = {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      storeId: userData.storeId,
    };

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    // In development, allow fallback test user when Firestore fails
    if (process.env.NODE_ENV === 'development' || !process.env.FIREBASE_PROJECT_ID) {
      if (email === DEV_TEST_USER.email && password === DEV_TEST_USER.password) {
        console.log('Using development fallback user (Firestore connection failed)');
        return { success: true, user: DEV_TEST_USER.user };
      }
    }
    return { success: false, error: '登入失敗，請稍後再試' };
  }
}

// Create user in Firestore
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserSession['role'] = 'editor',
  storeId?: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const userRef = db.collection('users').doc();
    await userRef.set({
      email,
      name,
      passwordHash,
      role,
      storeId: storeId || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, userId: userRef.id };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: '建立使用者失敗' };
  }
}

// Check if user has required role
export function requireAuth(allowedRoles?: UserSession['role'][]) {
  return async function checkAuth() {
    const session = await getSession();

    if (!session) {
      return { authorized: false, redirect: '/admin/login' };
    }

    if (allowedRoles && !allowedRoles.includes(session.role)) {
      return { authorized: false, redirect: '/admin/dashboard' };
    }

    return { authorized: true, user: session };
  };
}
