'use client';


/**
 * Handles 401 Unauthorized responses by logging out the user
 * This utility is designed to work with the middleware's x-handle-auth-error header
 */
export const handleAuthError = async (response: Response): Promise<Response> => {
  // Check if the response has the auth error handling header and status is 401
  if (response.headers.get('x-handle-auth-error') === 'true' && response.status === 401) {
    console.log('Received 401 response, logging out user');
    
    // Store the current path for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('loginRedirect', currentPath);
    
    // Logout the user
    // await logout();
    
    // Return a modified response to prevent further processing
    return new Response(JSON.stringify({ error: 'Unauthorized', redirecting: true }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // If not a 401 or doesn't have the header, return the original response
  return response;
};

/**
 * Wraps fetch to handle 401 responses
 */
export const fetchWithAuthErrorHandling = async (url: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(url, options);
  return handleAuthError(response);
};