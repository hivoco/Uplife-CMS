import api from './axios';
import type { DashboardStats } from '../types';

export const getStats = () =>
  api.get<DashboardStats>('/dashboard/stats');
