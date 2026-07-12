export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Generic API fetch wrapper to handle JSON responses and errors.
 * @param {string} endpoint - The API endpoint path (e.g. '/api/drivers')
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add Authorization header here if needed in the future
    // "Authorization": `Bearer ${token}`
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
