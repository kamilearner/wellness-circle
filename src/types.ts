export interface User {
  name: string;
  birth_year: number;
}

export interface HealthReminder {
  id: string;
  title: string;
  description: string;
  frequency: string;
  start_age: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image_url: string;
}

export interface Post {
  id: string;
  author_name: string;
  content: string;
  timestamp: Date;
  likes: number;
}