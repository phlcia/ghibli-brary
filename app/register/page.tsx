import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { RegisterForm } from '@/components/forms/RegisterForm';
import { authOptions } from '@/lib/auth';

export default async function RegisterPage() {
  const session = await getServerSession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authOptions as any,
  );
  const userId = (session as { user?: { id?: string | number } } | null)?.user?.id;

  if (userId) {
    redirect('/');
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-forest-primary">Create account</h1>
        <p className="text-sm text-forest-muted">Sign up to start favoriting films.</p>
      </div>
      <div className="rounded-2xl border border-forest-soft surface-panel p-6 shadow-lg">
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-forest-muted">
          Already registered?{' '}
          <Link href="/login" className="text-[color:var(--color-sky-300)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
