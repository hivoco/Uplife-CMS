import api from './axios';
import type { Blog, BlogListItem, PaginatedResponse } from '../types';

export const getBlogs = (page: number = 1, perPage: number = 10) =>
  api.get<PaginatedResponse<BlogListItem>>('/blogs', {
    params: { page, per_page: perPage },
  });

export const getBlog = (id: number) =>
  api.get<Blog>(`/blogs/${id}`);

export const createBlog = (formData: FormData) =>
  api.post<Blog>('/blogs', formData);

export const updateBlog = (id: number, formData: FormData) =>
  api.put<Blog>(`/blogs/${id}`, formData);

export const deleteBlog = (id: number) =>
  api.delete(`/blogs/${id}`);

export const uploadBlogImage = (file: File) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post<{ url: string }>('/blogs/upload-image', fd);
};
