import { useWishlist } from '../context/WishlistContext';

export default function useCart() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    changeItemSize,
    clearCart,
    isCartOpen,
    closeCart,
    toggleCart,
  } = useWishlist();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    changeItemSize,
    clearCart,
    isCartOpen,
    closeCart,
    toggleCart,
  };
}
