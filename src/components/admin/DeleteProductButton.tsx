'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { adminDeleteProduct } from '@/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;

    setLoading(true);
    const result = await adminDeleteProduct(productId);
    if (result.success) {
      toast.success('Product deleted');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete product"
    >
      <Trash2 size={16} className={loading ? 'animate-spin' : ''} />
    </button>
  );
}