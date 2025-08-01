import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Esto hace que en todas las peticiones que se hagan con este cliente axios
// se incluya el token de autenticación en los headers de la petición.
// Esto es útil para que no tengamos que enviar el token manualmente en cada petición
// y así mantener el código más limpio y evitar errores de olvido.
api.interceptors.request.use((config) => {

  const token = localStorage.getItem('AUTH_TOKEN');
  if(token){
     config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})


export default api;