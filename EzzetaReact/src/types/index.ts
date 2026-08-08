export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  previousPrice?: number;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  "mini-image"?: string[];
  sizes: string[];
  featured?: boolean;
  relatedIds?: number[];
  extras?: string[];
  stock?: number;
  sizesStock?: Record<string, number>;
  activo?: boolean;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface PageContent {
  title: string;
  description: string;
  intro: string;
}

export interface ContactContent {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface RecommendationEntry {
  title: string;
  author: string;
  quote: string;
}

export interface PolicyItem {
  title: string;
  text: string;
}

export interface TermsContent {
  title: string;
  description: string;
  sections: PolicyItem[];
}

export * from './auth';
