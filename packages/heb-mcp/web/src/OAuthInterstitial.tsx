import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useIdentity } from './identity';

export default function OAuthInterstitial() {
  const { signedIn, isLoaded, openSignIn } = useIdentity();

  useEffect(() => {
    if (!isLoaded) return;

    if (signedIn) {
      // User is signed in, cookie should now be synced. Reload to let backend see it.
      const url = new URL(window.location.href);
      url.searchParams.set('_t', Date.now().toString());
      window.location.href = url.toString();
    } else {
      openSignIn();
    }
  }, [signedIn, isLoaded, openSignIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-heb-red animate-spin mb-4" />
        <p className="text-heb-gray font-medium">Redirecting...</p>
    </div>
  );
}
