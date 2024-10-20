export async function httpRequest<T>(
    url: string,
    method: string = 'GET',
    body?: Record<string, any>,
    headers: Record<string, string> = { 'Content-Type': 'application/json' }
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Request failed');
    }
  
    return response.json();
  }
  