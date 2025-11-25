import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await kv.get<User>(`user:email:${email}`);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const user = await kv.get<User>(`user:username:${username}`);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Create new user
export async function createUser(email: string, username: string, password: string): Promise<User | null> {
  try {
    // Check if user already exists
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user: User = {
      id: crypto.randomUUID(),
      email,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // Store user by email and username for lookup
    await kv.set(`user:email:${email}`, user);
    await kv.set(`user:username:${username}`, user);
    await kv.set(`user:id:${user.id}`, user);

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Try to find user by email or username
        let user = await getUserByEmail(credentials.username);
        if (!user) {
          user = await getUserByUsername(credentials.username);
        }

        if (!user) {
          return null;
        }

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Return user without password hash
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
