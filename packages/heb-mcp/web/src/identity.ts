import { useAuth, useClerk, useUser } from '@clerk/clerk-react';

export type Identity = {
  isLoaded: boolean;
  signedIn: boolean;
  label: string | null;
  getToken: (options?: { template?: string }) => Promise<string | null>;
  openSignIn: () => void;
  signOut: () => void;
};

const config = typeof window === 'undefined' ? undefined : window.__connectConfig;
const clerkEnabled = Boolean(config?.clerkPublishableKey);

function useClerkIdentity(): Identity {
  const { getToken, isLoaded } = useAuth();
  const { openSignIn, signOut } = useClerk();
  const { user } = useUser();

  return {
    isLoaded,
    signedIn: Boolean(user),
    label: user ? user.primaryEmailAddress?.emailAddress ?? user.username ?? null : null,
    getToken: (options) => getToken({ template: options?.template }),
    openSignIn: () => openSignIn({ forceRedirectUrl: window.location.href }),
    signOut: () => signOut(),
  };
}

function useProxyIdentity(): Identity {
  const proxyAuth = config?.proxyAuth ?? null;

  return {
    isLoaded: true,
    signedIn: Boolean(proxyAuth),
    label: proxyAuth?.label ?? null,
    getToken: async () => null,
    openSignIn: () => {
      const signInUrl = config?.signInUrl;
      if (signInUrl) window.location.href = signInUrl;
    },
    signOut: () => {},
  };
}

/**
 * The caller's identity, from Clerk when it is configured and from the
 * reverse proxy otherwise.
 */
export const useIdentity: () => Identity = clerkEnabled ? useClerkIdentity : useProxyIdentity;
