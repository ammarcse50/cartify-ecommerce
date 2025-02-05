import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomInt } from "crypto";

// Custom JSON serializer to handle BigInt fields
const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // Convert BigInt to string
  );
};

// NextAuth configuration object
export const authOption = {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Credentials Provider (username/password login)
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        console.log(email, password);

        if (!email || !password) {
          console.error("Missing email or password.");
          return null;
        }

        try {
          const currentUser = await prisma.users.findFirst({
            where: { email },
          });

          if (!currentUser) {
            console.error("User not found");
            return null;
          }

          const passwordMatched = await bcrypt.compare(password, currentUser.password);
          if (!passwordMatched) {
            console.error("Invalid password.");
            return null;
          }

          // Serialize BigInt fields before returning the user
          return JSON.parse(json(currentUser)); // Deserialize back to object after serialization
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),

    // Google Provider (OAuth login)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // SignIn Callback (Handle custom sign-in logic like OAuth integration)
    // JWT callback - Adding user fields to JWT token
    async signIn({ user, account }) {

      console.log("signIN before ");
      setTimeout(() => {
        console.log("after signIn execution");
      }, 1000);
      console.log("after execution signIn");
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          // Check if user already exists in the database
          const userExist = await prisma.users.findFirst({
            where: { email },
          });
          if (!userExist) {
            console.log("User does not exist, creating a new user...");

            // If user doesn't exist, create a new one
            const newUser = await prisma.users.create({
              data: {
                email,
                password: user.password || "", // Google users don't have a password
                username: user.name, // Default to email if name is not available
                company_id: Number(randomInt(1, 33)), // Generate company_id between 1 and 32
                created_at: new Date(), // Current timestamp
                created_by: Number(Date.now()), // Unix timestamp in milliseconds
                updated_at: new Date(),
                updated_by: Number(Date.now()),
                username_secondary: name || "", // Use name as secondary username
                phone: user.phone || null, // You can leave it empty or populate from Google data if available
                language_id_default_choice: null,
                is_active: true,
                is_approved: true,
                is_default_user: true,
                is_lock: false,
                is_temporary_password: false,
                role_id: Number(randomInt(1, 20)), // Generate role_id between 1 and 19
              },
            });
            console.log("New user created:", newUser);
            return true; // User created successfully
          } else {
            console.log("Existing user found:", email);
            return true; // User already exists
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false; // If error occurs, deny sign-in
        }
      } else {
        return user; // Handle non-Google sign-ins normally
      }
    },
    async jwt({ token, user }) {
      console.log("jwt before ");
      setTimeout(() => {
        console.log("after jwt execution");
      }, 1000);
      console.log("after execution jwt");

      if (user) {
        console.log("Adding user data to JWT:");
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone || "";
        token.company_id = user.company_id || null;
        token.username = user.username || "";
        token.username_secondary = user.username_secondary || "";
        token.role_id = user.role_id || null;
        token.language_id_default_choice = user.language_id_default_choice || null;
        token.is_lock = user.is_lock || false;
        token.is_active = user.is_active || true;
        token.is_approved = user.is_approved || true;
        token.is_temporary_password = user.is_temporary_password || false;
        token.created_at = user.created_at || new Date();
        token.created_by = user.created_by || 0;
        token.updated_at = user.updated_at || new Date();
        token.updated_by = user.updated_by || 0;
      }
      return token;
    },

    // Session callback - Adding token data to session
    async session({ session, token }) {
      console.log("session before ");
      setTimeout(() => {
        console.log("after session execution");
      }, 1000);
      console.log("after execution session");
      if (token) {
        console.log("Adding token data to session:");
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.company_id = token.company_id;
        session.user.username = token.username;
        session.user.username_secondary = token.username_secondary;
        session.user.role_id = token.role_id;
        session.user.language_id_default_choice = token.language_id_default_choice;
        session.user.is_lock = token.is_lock;
        session.user.is_active = token.is_active;
        session.user.is_approved = token.is_approved;
        session.user.is_temporary_password = token.is_temporary_password;
        session.user.created_at = token.created_at;
        session.user.created_by = token.created_by;
        session.user.updated_at = token.updated_at;
        session.user.updated_by = token.updated_by;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to custom login page
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOption);

// Export handler for GET and POST requests
export { handler as GET, handler as POST };
