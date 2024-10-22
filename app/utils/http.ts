
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ExtendedSession extends Session {
  accessToken: string;
}


export async function httpRequest<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: Record<string, any>,
  headers: Record<string, string> = { 'Content-Type': 'application/json' }
): Promise<T> {
  const session: Session | null = await getSession();
  

  if (session && (session as ExtendedSession).accessToken) {
    const extendedSession = session as ExtendedSession;
    headers['Authorization'] = `Bearer ${extendedSession.accessToken}`;
  }
  headers['Accept'] = 'application/ld+json';
  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URI + endpoint, options);

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Request failed');
  }

  return response.json() as Promise<T>;
}
