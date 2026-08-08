import categories from '../data/homeCategories.json';
import slides from '../data/homeSlides.json';
import type { Product } from '../types';
import { getProducts as getUnifiedProducts } from './contentService';

export const getHomeSlides = () => slides;
export const getHomeCategories = () => categories;
export const getHomeProducts = (): Product[] => getUnifiedProducts();
export const getTopFeaturedProducts = (): Product[] =>
  getUnifiedProducts().filter((product) => product.featured).slice(0, 12);
export const getBestSellers = (): Product[] =>
  getUnifiedProducts().slice(0, 16);
