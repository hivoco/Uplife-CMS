import api from './axios';
import type { InstaPost } from '../types';

export const getInstaPosts = () =>
  api.get<InstaPost[]>('/insta-posts');

export const createInstaPost = (post_url: string, sort_order: number = 0) =>
  api.post<InstaPost>('/insta-posts', { post_url, sort_order });

export const updateInstaPost = (id: number, sort_order: number) =>
  api.put<InstaPost>(`/insta-posts/${id}`, { sort_order });

export const deleteInstaPost = (id: number) =>
  api.delete(`/insta-posts/${id}`);
