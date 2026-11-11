'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Admin session store.
 *
 * The admin console is a purely client-side tool, but the *login* is
 * validated on the server by `POST /api/admin/login`, which returns a signed,
 * time-limited session token. This module stores that token and exposes the
 * session through an external store so React can read it without a
 * setState-in-effect.
 */

const SESSION_KEY = 'omnitool_admin_session';

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

interface StoredSession {
  authenticated: boolean;
  email: string;
  token: string;
  expiresAt: number;
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.token || !parsed.expiresAt) return false;
    // Expired sessions are treated as signed out and cleaned up.
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

/** True when a valid, unexpired admin session exists in this browser. */
export function useAdminSession(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True only after the client has hydrated.
 *
 * The server snapshot of `useAdminSession()` is always `false`, so a
 * redirect guard must wait for hydration before deciding the user is signed
 * out — otherwise a hard navigation to a protected page would bounce a
 * signed-in user to the login screen.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    clientTrue,
    clientFalse,
  );
}

const noopSubscribe = () => () => {};
const clientTrue = () => true;
const clientFalse = () => false;

/**
 * Stores a session returned by the login endpoint.
 * The token is issued and signed by the server; the browser never decides
 * whether a login is valid.
 */
export function createAdminSession(email: string, token: string, expiresAt: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ authenticated: true, email, token, expiresAt }),
  );
  emit();
}

/** Ends the local admin session. */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  emit();
}

/** Returns a stable callback that clears the session and redirects to login. */
export function useSignOut(onSignedOut: () => void) {
  return useCallback(() => {
    clearAdminSession();
    onSignedOut();
  }, [onSignedOut]);
}
