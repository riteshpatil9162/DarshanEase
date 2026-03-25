import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Temples
export const getTemples = (params) => API.get('/temples', { params });
export const getTempleById = (id) => API.get(`/temples/${id}`);
export const createTemple = (data) => API.post('/temples', data);
export const updateTemple = (id, data) => API.put(`/temples/${id}`, data);
export const deleteTemple = (id) => API.delete(`/temples/${id}`);

// Slots
export const getSlotsByTemple = (templeId, params) => API.get(`/slots/${templeId}`, { params });
export const getAllSlots = () => API.get('/slots');
export const createSlot = (data) => API.post('/slots', data);
export const updateSlot = (id, data) => API.put(`/slots/${id}`, data);
export const deleteSlot = (id) => API.delete(`/slots/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/user');
export const getAllBookings = (params) => API.get('/bookings', { params });
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);

// Donations
export const createDonation = (data) => API.post('/donations', data);
export const getDonations = () => API.get('/donations');

// Payment
export const createOrder = (data) => API.post('/payment/order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);

export default API;
