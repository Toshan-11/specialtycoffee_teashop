'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { registerUser } from '@/actions';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Auto sign in
        await signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: false,
        });
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Leaf className="w-8 h-8 text-brand-gold mx-auto mb-4" />
          <h1 className="font-display text-3xl text-brand-cream">
            Join Brew & Leaf
          </h1>
          <p className="text-brand-muted mt-2">
            Create an account and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
