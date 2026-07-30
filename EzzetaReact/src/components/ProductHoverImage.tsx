import { useState } from 'react';
import type { Product } from '../types';

type ProductHoverImageProps = {
  product: Product;
  alt: string;
  className?: string;
};

export const ProductHoverImage = ({
  product,
  alt,
  className,
}: ProductHoverImageProps) => {
  const [hover, setHover] = useState(false);

  const hoverImage = product["mini-image"]?.[1];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={product.image}
        alt={alt}
        draggable={false}
        className={`${className} absolute inset-0 transition-opacity duration-300 ${
          hover && hoverImage ? "opacity-0" : "opacity-100"
        }`}
      />

      {hoverImage && (
        <img
          src={hoverImage}
          alt={alt}
          draggable={false}
          className={`${className} absolute inset-0 transition-opacity duration-300 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};