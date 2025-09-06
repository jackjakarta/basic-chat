export const MOCK_USER = (() => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'E2E test environment variables E2E_USER_EMAIL and E2E_USER_PASSWORD must be set.',
    );
  }
  return { email, password };
})();
