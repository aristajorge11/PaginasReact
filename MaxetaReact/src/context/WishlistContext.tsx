import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type CartItem = {
  productId: number;
  quantity: number;
  size: string;
};

type WishlistContextType = {
  favorites: number[];
  cart: CartItem[];
  isCartOpen: boolean;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addToCart: (productId: number, size: string, quantity?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  changeItemSize: (productId: number, oldSize: string, newSize: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleFavorite = (productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  const addToCart = (productId: number, size: string, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId && item.size === size);

      if (existing) {
        return current.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, { productId, quantity, size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart((current) => current.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item,
      ),
    );
  };

  const changeItemSize = (productId: number, oldSize: string, newSize: string) => {
    setCart((current) => {
      let oldQuantity = 0;
      const hasNewSize = current.some((item) => item.productId === productId && item.size === newSize);

      const updated = current
        .map((item) => {
          if (item.productId === productId && item.size === oldSize) {
            oldQuantity = item.quantity;
            return null;
          }
          if (hasNewSize && item.productId === productId && item.size === newSize) {
            return { ...item, quantity: item.quantity + oldQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      if (!hasNewSize && oldQuantity > 0) {
        return [...updated, { productId, size: newSize, quantity: oldQuantity }];
      }

      return updated;
    });
  };

  const clearCart = () => setCart([]);
  const toggleCart = () => setIsCartOpen((current) => !current);
  const closeCart = () => setIsCartOpen(false);

  const value = useMemo(
    () => ({
      favorites,
      cart,
      isCartOpen,
      toggleFavorite,
      isFavorite,
      addToCart,
      removeFromCart,
      updateQuantity,
      changeItemSize,
      clearCart,
      toggleCart,
      closeCart,
    }),
    [favorites, cart, isCartOpen],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
};
