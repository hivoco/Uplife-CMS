import api from './axios';
import type { Contact, PaginatedResponse } from '../types';

export const getContacts = (page: number = 1, perPage: number = 20) =>
  api.get<PaginatedResponse<Contact>>('/contacts', {
    params: { page, per_page: perPage },
  });
