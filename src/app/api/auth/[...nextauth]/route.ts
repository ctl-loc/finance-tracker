/* eslint-disable @typescript-eslint/no-unused-vars */
import { login } from "@/lib/auth";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const provider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: {},
    password: {},
  },
  // function call on signIn
  async authorize(credentials, req) {
    console.log("authorizing", credentials);
    if (!credentials) return null;
    if (!credentials.email || !credentials.password) return null;

    const { user } = await login(credentials?.email, credentials.password);
    return (user as unknown as User) ?? null;
  },
});

const handler = NextAuth({
  providers: [provider],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // sanitize cookie
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
