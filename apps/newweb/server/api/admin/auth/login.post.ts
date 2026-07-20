import { loginWithCredentials, createToken, setSessionCookie } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '請輸入帳號和密碼',
    });
  }

  const result = await loginWithCredentials(email, password);

  if (!result.success || !result.user) {
    throw createError({
      statusCode: 401,
      statusMessage: result.error || '登入失敗',
    });
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
