import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching users." },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  const { email, password, name, image } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { email },
      });

      if (user) {
        // User exists, check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return { message: "Login successful", user };
      } else {
        // User doesn't exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name, // Save the user's name
            image, // Save the user's image URL
          },
        });

        return { message: "Signup successful", newUser };
      }
    });

    // Send response back to frontend
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
