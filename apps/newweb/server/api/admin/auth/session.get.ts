import { getSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const session = await getSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登入',
    });
  }

  return {
    success: true,
    user: session,
  };
});
