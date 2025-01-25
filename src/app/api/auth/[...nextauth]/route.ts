import bcrypt from 'bcryptjs';
import prisma from "@/app/lib/db";
import NextAuth from "next-auth/next";

import CredentialsProvider from "next-auth/providers/credentials";

export const authOption = {

  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: {
    strategy: "jwt"
    ,
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials, req) {

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const currentUser = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!currentUser) {
          return null;
        }
        console.log("currentUser", currentUser);
        const passwordMatched = bcrypt.compare(password, currentUser.password)

        if (!passwordMatched) {
          return null;
        }



        return currentUser;

      }
    })
  ],
  callbacks: {},
  pages: {

    signIn: "/login"

  }

}
const handler = NextAuth(authOption)




export { handler as GET, handler as POST }