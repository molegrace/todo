const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const SESSION_STORAGE_KEY = "todo.authSession";

type StoredSession = {
  uid: string;
  startedAt: number;
};

const getStoredSession = (): StoredSession | null => {
  const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!storedValue) return null;

  try {
    const session = JSON.parse(storedValue) as StoredSession;
    if (typeof session.uid !== "string" || typeof session.startedAt !== "number") {
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const startAuthSession = (uid: string) => {
  const session: StoredSession = { uid, startedAt: Date.now() };
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const getAuthSessionExpiry = (uid: string): number | null => {
  const session = getStoredSession();
  if (!session || session.uid !== uid) return null;

  return session.startedAt + SESSION_DURATION_MS;
};

export const isAuthSessionExpired = (uid: string): boolean => {
  const expiry = getAuthSessionExpiry(uid);
  return expiry !== null && Date.now() >= expiry;
};

export const hasAuthSession = (uid: string): boolean =>
  getAuthSessionExpiry(uid) !== null;

export { SESSION_DURATION_MS, SESSION_STORAGE_KEY };
