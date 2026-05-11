const sessionStorageKey = "crm-tasaciones-session-id";

export function getOrCreateSessionId(): string {
  const existingSessionId = window.localStorage.getItem(sessionStorageKey);

  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(sessionStorageKey, sessionId);

  return sessionId;
}
