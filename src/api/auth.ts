import api from './axios';

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const verifyOtp = (email: string, otp: string) =>
  api.post('/auth/verify-otp', { email, otp });
