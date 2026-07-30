import type { ContactContent, PageContent, PolicyItem, Product, TermsContent } from '../types';
import navigation from '../data/navigation.json';
import products from '../data/products.json';
import about from '../data/about.json';
import contact from '../data/contact.json';
import policies from '../data/policies.json';
import terms from '../data/terms.json';

export const getNavigation = () => navigation;

export const getProducts = (): Product[] => products as Product[];

export const getFeaturedProducts = (): Product[] =>
  (products as Product[]).filter((product) => product.featured);

export const getProductBySlug = (slug: string): Product | undefined =>
  (products as Product[]).find((product) => product.slug === slug);

export const getRelatedProducts = (productId: number): Product[] => {
  const source = products as Product[];
  const product = source.find((item) => item.id === productId);

  if (!product) {
    return [];
  }

  const related = product.relatedIds?.length
    ? source.filter((item) => item.id !== productId && product.relatedIds?.includes(item.id))
    : [];

  if (related.length >= 3) {
    return related.slice(0, 3);
  }

  const fallback = source
    .filter((item) => item.id !== productId && !related.some((relatedItem) => relatedItem.id === item.id))
    .slice(0, 3 - related.length);

  return [...related, ...fallback];
};

export const getAboutContent = (): PageContent => about as PageContent;

export const getContactContent = (): ContactContent => contact as ContactContent;

export const getPolicies = (): PolicyItem[] => policies as PolicyItem[];

export const getTermsContent = (): TermsContent => terms as TermsContent;
