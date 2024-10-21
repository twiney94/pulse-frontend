type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function httpRequest<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: Record<string, any>,
    headers: Record<string, string> = { 'Content-Type': 'application/json' }
  ): Promise<T> {
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
  
    return response.json();
  }
  