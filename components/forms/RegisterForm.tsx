'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? 'Registration failed');
      return;
    }

    setSuccess(true);
    setEmail('');
    setPassword('');
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forest-primary" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-lg border border-forest-soft bg-transparent px-3 py-2 text-forest-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forest-primary" htmlFor="reg-password">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-forest-soft bg-transparent px-3 py-2 text-forest-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--color-sky-300)]"
        />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-green-300">Account created!</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-accent w-full rounded-lg px-4 py-2 text-center text-sm font-semibold"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
