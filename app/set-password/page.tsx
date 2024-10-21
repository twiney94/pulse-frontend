"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { httpRequest } from '@/app/utils/http';

const SetPasswordPage = () => {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const validationToken = urlParams.get('validationToken');

      if (!validationToken || typeof validationToken !== 'string') {
        router.push('/login');
        return;
      }

      try {
        const parsedDecodedToken = JSON.parse(atob(validationToken));
      
        if (!parsedDecodedToken || typeof parsedDecodedToken !== 'object' || !parsedDecodedToken.email || !parsedDecodedToken.code) {
          throw new Error('Invalid token format');
        }

        const { email, code } = parsedDecodedToken;

        await httpRequest('/users/validation', 'POST', { email, code });

        router.push('/login');
      } catch (error) {
        console.error('Token validation failed:', error);
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);

  return (
    <div>
      <p>Validating token, please wait...</p>
    </div>
  );
};

export default SetPasswordPage;

