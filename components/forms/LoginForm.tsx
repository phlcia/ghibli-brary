'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid credentials');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forest-primary" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-lg border border-forest-soft bg-transparent px-3 py-2 text-forest-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forest-primary" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-lg border border-forest-soft bg-transparent px-3 py-2 text-forest-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
        />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-accent w-full rounded-lg px-4 py-2 text-center text-sm font-semibold"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
