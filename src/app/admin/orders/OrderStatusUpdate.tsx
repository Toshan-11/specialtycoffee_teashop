'use client';

import { updateOrderStatus } from '@/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const result = await updateOrderStatus(orderId, e.target.value);
    if (result.success) {
      toast.success('Order status updated');
      router.refresh();
    }
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="bg-brand-charcoal border border-brand-gray text-brand-light text-xs px-3 py-2 focus:border-brand-gold focus:outline-none"
    >
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
