'use client';

import { updateSubscriptionStatus } from '@/actions';
import { Pause, Play, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  status: string;
}

export default function SubscriptionActions({ id, status }: Props) {
  const router = useRouter();

  const handleAction = async (newStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    const result = await updateSubscriptionStatus(id, newStatus);
    if (result.success) {
      toast.success(
        newStatus === 'ACTIVE'
          ? 'Subscription resumed'
          : newStatus === 'PAUSED'
          ? 'Subscription paused'
          : 'Subscription cancelled'
      );
      router.refresh();
    }
  };

  if (status === 'CANCELLED') return null;

  return (
    <div className="flex items-center gap-2">
      {status === 'ACTIVE' ? (
        <button
          onClick={() => handleAction('PAUSED')}
          className="p-2 text-brand-muted hover:text-yellow-400 transition-colors"
          title="Pause"
        >
          <Pause size={16} />
        </button>
      ) : (
        <button
          onClick={() => handleAction('ACTIVE')}
          className="p-2 text-brand-muted hover:text-green-400 transition-colors"
          title="Resume"
        >
          <Play size={16} />
        </button>
      )}
      <button
        onClick={() => {
          if (confirm('Cancel this subscription?')) {
            handleAction('CANCELLED');
          }
        }}
        className="p-2 text-brand-muted hover:text-red-400 transition-colors"
        title="Cancel"
      >
        <X size={16} />
      </button>
    </div>
  );
}
