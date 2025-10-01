'use client';
import { register } from '@/app/lib/auth';
import { useActionState } from 'react';

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, { message: "" });

  return (
    <main className="flex items-center justify-center md:h-screen">
      <form
        action={formAction}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full rounded border p-2"
            required
          />
          {state?.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded border p-2"
            required
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full rounded border p-2"
            required
          />
          {state?.errors?.password && (
            <p className="text-sm text-red-500">{state.errors.password[0]}</p>
          )}
        </div>

        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </main>
  );
}
