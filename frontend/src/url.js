export const URL=import.meta.env.VITE_URL
export const IF=import.meta.env.VITE_IF
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

fetch(`${API_BASE_URL}/api/posts`)
  .then(res => res.json())
  .then(data => console.log(data));

