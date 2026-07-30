import { createElement, lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';

export const lazyImport = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) => {
  return lazy(factory) as LazyExoticComponent<T>;
};

export const withSuspense = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        'div',
        { className: 'rounded-[1.5rem] border border-black/10 bg-white p-8 text-center text-sm text-black/70' },
        'Cargando...'
      ),
    },
    createElement(Component)
  );
