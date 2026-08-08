import type { Product } from '../types';
import { resolveProductPrice } from '../services/pricingService';

type Props = {
  product: Product;
  cantidad?: number;
  className?: string;
};

export const PriceDisplay = ({ product, cantidad, className = '' }: Props) => {
  const resultado = resolveProductPrice(product, { cantidad: cantidad ?? 1 });
  const precioOriginal = resultado.precioOriginal;
  const precioFinal = resultado.precioFinal;
  const hayDescuento = resultado.descuentoAplicado > 0 && precioFinal < precioOriginal;

  return (
    <span className={`price-display inline-flex flex-col ${className}`}>
      {hayDescuento ? (
        <>
          <span className="text-sm text-black/40 line-through">S/{precioOriginal.toFixed(2)}</span>
          <span className="text-lg font-extrabold text-red-600">S/{precioFinal.toFixed(2)}</span>
        </>
      ) : (
        <span className="text-lg font-semibold text-red-600">S/{precioFinal.toFixed(2)}</span>
      )}
    </span>
  );
};

export default PriceDisplay;
