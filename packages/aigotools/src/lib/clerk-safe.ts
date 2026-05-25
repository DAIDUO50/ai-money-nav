/**
 * Safe wrapper for Clerk's useAuth/useUser hooks.
 * Returns null when used outside ClerkProvider (e.g. no auth configured),
 * preventing "useAuth can only be used within ClerkProvider" crashes.
 */
import { useAuth as useClerkAuth } from "@clerk/nextjs";

export function useClerkSafe() {
  try {
    return useClerkAuth();
  } catch {
    // Outside ClerkProvider — return a safe default
    return { isSignedIn: false, isLoaded: true, userId: null };
  }
}
