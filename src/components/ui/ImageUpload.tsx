'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 4,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);

    // Validate file types and sizes
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange([...images, ...data.urls]);
      toast.success(
        `${data.urls.length} image${data.urls.length > 1 ? 's' : ''} uploaded`
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs text-brand-muted uppercase tracking-wider">
        Product Images ({images.length}/{maxImages})
      </label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square group">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover border border-brand-gray/30"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-gold text-brand-black text-[10px] font-bold uppercase">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-brand-gold bg-brand-gold/5'
              : 'border-brand-gray hover:border-brand-light'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-brand-gold animate-spin" />
              <p className="text-sm text-brand-light">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {dragActive ? (
                <ImageIcon size={32} className="text-brand-gold" />
              ) : (
                <Upload size={32} className="text-brand-muted" />
              )}
              <p className="text-sm text-brand-light">
                {dragActive ? 'Drop images here' : 'Click or drag images to upload'}
              </p>
              <p className="text-xs text-brand-muted">
                PNG, JPG, WebP up to 5MB &bull; Max {maxImages} images
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
