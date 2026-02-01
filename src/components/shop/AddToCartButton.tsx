'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [grind, setGrind] = useState('whole-bean');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const grindOptions = [
    { value: 'whole-bean', label: 'Whole Bean' },
    { value: 'coarse', label: 'Coarse (French Press)' },
    { value: 'medium', label: 'Medium (Drip)' },
    { value: 'fine', label: 'Fine (Espresso)' },
    { value: 'extra-fine', label: 'Extra Fine (Turkish)' },
  ];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      grind,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Grind selector */}
      <div>
        <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
          Grind
        </label>
        <div className="grid grid-cols-2 gap-2">
          {grindOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setGrind(option.value)}
              className={`px-3 py-2 text-xs border transition-colors duration-200 ${
                grind === option.value
                  ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                  : 'border-brand-gray text-brand-muted hover:border-brand-light'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 border border-brand-gray text-brand-light hover:border-brand-gold transition-colors flex items-center justify-center text-lg"
          >
            &minus;
          </button>
          <span className="w-16 h-12 border-y border-brand-gray text-brand-cream flex items-center justify-center font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 border border-brand-gray text-brand-light hover:border-brand-gold transition-colors flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        className={`w-full py-4 flex items-center justify-center gap-2 font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'
        }`}
      >
        {added ? (
          <>
            <Check size={18} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
