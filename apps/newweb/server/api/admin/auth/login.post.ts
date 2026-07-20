import { loginWithCredentials, createToken, setSessionCookie } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: '請輸入帳號和密碼',
    };
  }

  const result = await loginWithCredentials(email, password);

  if (!result.success || !result.user) {
    setResponseStatus(event, 401);
    return {
      success: false,
      error: result.error || '登入失敗',
    };
  }

  // Create JWT token
  const token = await createToken(result.user);

  // Set session cookie
  setSessionCookie(event, token);

  return {
    success: true,
    user: result.user,
  };
});
