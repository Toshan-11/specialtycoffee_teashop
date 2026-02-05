'use client';

import { useState } from 'react';
import { adminCreateProduct } from '@/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

interface Props {
  categories: { id: string; name: string }[];
}

export default function AdminProductActions({ categories }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('images', JSON.stringify(images));

    const result = await adminCreateProduct(formData);
    if (result.success) {
      toast.success('Product created!');
      setShowForm(false);
      setImages([]);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to create product');
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary flex items-center gap-2 mb-4"
      >
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? 'Cancel' : 'Add Product'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 border border-brand-gray/30 bg-brand-dark space-y-4"
        >
          {/* Image Upload */}
          <ImageUpload images={images} onChange={setImages} maxImages={4} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Product Name
              </label>
              <input name="name" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Category
              </label>
              <select name="categoryId" className="input-field" required>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Price ($)
              </label>
              <input name="price" type="number" step="0.01" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Origin
              </label>
              <input name="origin" className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Weight
              </label>
              <input name="weight" className="input-field" placeholder="e.g. 340g" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                Flavor Notes (comma separated)
              </label>
              <input name="flavorNotes" className="input-field" placeholder="Chocolate, Caramel, Nutty" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea name="description" className="input-field h-32" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      )}
    </div>
  );
}
