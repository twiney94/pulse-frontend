import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { decode } from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const data = await res.json();

          const jwt = decode(data.token);
          console.log("🚀 ~ authorize: ~ jwt:", jwt)

          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          if (data.token) {
            if (jwt && typeof jwt === 'object' && 'id' in jwt) {
              return { _id: jwt.id, token: data.token, role: jwt.role };
            }
            throw new Error("Invalid token");
          }

          return data;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    newUser: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
