import { NextResponse } from 'next/server';
import { createToken, setSessionCookie, loginWithCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: '請輸入 Email 和密碼' },
        { status: 400 }
      );
    }

    // Login with credentials (checks Firestore)
    const result = await loginWithCredentials(email.toLowerCase(), password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Email 或密碼錯誤' },
        { status: 401 }
      );
    }

    // Create JWT Token
    const token = await createToken(result.user);

    // Set Cookie
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登入失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
