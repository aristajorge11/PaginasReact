import categories from '../data/homeCategories.json';
import slides from '../data/homeSlides.json';
import products from '../data/products.json';
import type { Product } from '../types';

export const getHomeSlides = () => slides;
export const getHomeCategories = () => categories;
export const getHomeProducts = (): Product[] => products as Product[];
export const getTopFeaturedProducts = (): Product[] =>
  (products as Product[]).slice(0, 4);
export const getBestSellers = (): Product[] =>
  (products as Product[]).slice(0, 16);
