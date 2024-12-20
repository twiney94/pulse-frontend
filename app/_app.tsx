import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingScreen from '@/app/components/LoadingScreen';
import '../styles/globals.css';

import { AppProps } from 'next/app';

function PulseApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <LoadingScreen />}
      <Component {...pageProps} />
    </>
  );
}

export default PulseApp;
