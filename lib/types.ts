export type Platform =
  | 'all'
  | 'gemini'
  | 'chatgpt'
  | 'midjourney'
  | 'dalle'
  | 'claude'
  | 'stable-diffusion'
  | 'sora'
  | 'runway';

export interface Prompt {
  id: string;
  title: string;
  text: string;
  category: string;
  platform: string;
  tags: string[];
  image_url: string | null;
  likes: number;
  copies: number;
  is_featured: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export type SortOption = 'newest' | 'most_liked' | 'most_copied' | 'featured';

export interface FilterState {
  category: string;
  platform: Platform;
  search: string;
  sort: SortOption;
  tags: string[];
}
