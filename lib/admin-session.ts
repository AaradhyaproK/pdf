'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Admin session store.
 *
 * The admin console is a purely client-side tool, so the session lives in
 * localStorage. Reading it through an external store (rather than copying it
 * into state inside an effect) keeps the render output stable and avoids
 * cascading re-renders.
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

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(SESSION_KEY));
}

function getServerSnapshot(): boolean {
  return false;
}

/** True when a local admin session exists in this browser. */
export function useAdminSession(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Creates a local admin session. */
export function createAdminSession(email: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ authenticated: true, email, loginTime: new Date().toISOString() }),
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
