import api from './axios';
import type { FAQ } from '../types';

export const getFaqs = () =>
  api.get<FAQ[]>('/faqs');

export const getFaq = (id: number) =>
  api.get<FAQ>(`/faqs/${id}`);

export const createFaq = (data: { question: string; answer: string; sort_order?: number }) =>
  api.post<FAQ>('/faqs', data);

export const updateFaq = (id: number, data: { question?: string; answer?: string; sort_order?: number; is_active?: boolean }) =>
  api.put<FAQ>(`/faqs/${id}`, data);

export const deleteFaq = (id: number) =>
  api.delete(`/faqs/${id}`);
