'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Leaf className="w-8 h-8 text-brand-gold mx-auto mb-4" />
          <h1 className="font-display text-3xl text-brand-cream">Welcome Back</h1>
          <p className="text-brand-muted mt-2">Sign in to your Brew & Leaf account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-cream"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-gold hover:underline">
            Create one
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 p-4 border border-brand-gray/30 bg-brand-charcoal">
          <p className="text-xs text-brand-muted uppercase tracking-wider mb-2">
            Demo Accounts
          </p>
          <div className="space-y-1 text-xs text-brand-light">
            <p>
              <span className="text-brand-gold">Admin:</span>{' '}
              admin@brewandleaf.com / admin123
            </p>
            <p>
              <span className="text-brand-gold">Customer:</span>{' '}
              jane@example.com / customer123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
