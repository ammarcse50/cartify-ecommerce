import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption = {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const currentUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!currentUser) {
          return null;
        }
        console.log("currentUser", currentUser);

        const passwordMatched = await bcrypt.compare(password, currentUser.password); // Await bcrypt.compare

        if (!passwordMatched) {
          return null;
        }

        return currentUser;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        console.log("user", user);

        try {
          // Use findUnique to check for an existing user
          const userExist = await prisma.user.findFirst({
            where: { email },
          });

          if (!userExist) {
            const res = await prisma.user.create({
              data: {
                name: name,
                email: email,
                image: image || "",
                emailVerified: new Date(), // Use Date object for emailVerified
                password: "", // Google users have no password
              },
            });

            console.log("New user created:", res);
            return true; // User creation successful
          } else {
            return true; // User already exists
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false; // If there's an error, deny sign-in
        }
      } else {
        return true; // Handle non-Google sign-in as usual
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
