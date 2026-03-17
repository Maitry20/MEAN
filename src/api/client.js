// API helper — base URL for backend
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper to make authenticated requests
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jwt_token');
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 100)}...`);
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export default API;
