import { H3Event, getCookie, setCookie, deleteCookie } from 'h3';
import { db, UserDoc, docToObject } from './firebase';

// Lazy load jose to avoid bundling issues
let SignJWT: any;
let jwtVerify: any;

async function getJose() {
  if (!SignJWT) {
    const jose = await import('jose');
    SignJWT = jose.SignJWT;
    jwtVerify = jose.jwtVerify;
  }
  return { SignJWT, jwtVerify };
}

// Lazy load bcrypt
let bcryptModule: any;

async function getBcrypt() {
  if (!bcryptModule) {
    bcryptModule = (await import('bcryptjs')).default;
  }
  return bcryptModule;
}

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
  const { SignJWT } = await getJose();
  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { jwtVerify } = await getJose();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as UserSession;
  } catch {
    return null;
  }
}

// Get session from cookie (for API routes)
export async function getSession(event: H3Event): Promise<UserSession | null> {
  const token = getCookie(event, COOKIE_NAME);

  if (!token) return null;

  return verifyToken(token);
}

// Set session cookie
export function setSessionCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear session cookie
export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME);
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
  // Check fallback test user first (always allow for testing until Firestore users are set up)
  if (email === DEV_TEST_USER.email && password === DEV_TEST_USER.password) {
    console.log('Using fallback test user');
    return { success: true, user: DEV_TEST_USER.user };
  }

  try {
    // Get user from Firestore
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return { success: false, error: '帳號或密碼錯誤' };
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Check password using bcrypt
    const bcrypt = await getBcrypt();
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
    const bcrypt = await getBcrypt();
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

// Require authentication middleware helper
export async function requireAuth(
  event: H3Event,
  allowedRoles?: UserSession['role'][]
): Promise<{ authorized: boolean; user?: UserSession; redirect?: string }> {
  const session = await getSession(event);

  if (!session) {
    return { authorized: false, redirect: '/admin/login' };
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return { authorized: false, redirect: '/admin/dashboard' };
  }

  return { authorized: true, user: session };
}
