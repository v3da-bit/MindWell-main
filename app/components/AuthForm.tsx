'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthFormProps { mode: 'login' | 'signup'; }

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const header = mode === 'signup' ? 'Create your account' : 'Welcome back';
  const sub = mode === 'signup' ? 'Sign up to get started' : 'Sign in to continue';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Show popup notification
    alert('Authentication services were disabled');
    
    // Redirect to dashboard without authentication
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">{header}</h1>
      <p className="text-slate-600">{sub}</p>

      <form onSubmit={handleAuth} className="mt-6 space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded bg-indigo-600 text-white py-2 disabled:opacity-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
