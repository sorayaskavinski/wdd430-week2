'use server';

import { z } from 'zod';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function register(prevState: RegisterState, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form input.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // check if email exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    if (existingUser.length > 0) {
      return { message: 'Email already registered.' };
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    return { message: 'Database error: could not register user.' };
  }

  // redireciona para login depois do cadastro
  redirect('/login');
}
