export interface Contact {
  id: number;
  name: string;
  email: string;
  contact_no: string | null;
  message: string;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstaPost {
  id: number;
  post_url: string;
  sort_order: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface DashboardStats {
  total_contacts: number;
  total_blogs: number;
  total_faqs: number;
  weekly_contacts: number;
  daily_contacts: DailyCount[];
  recent_contacts: Contact[];
  recent_blogs: BlogListItem[];
  recent_faqs: FAQ[];
}
