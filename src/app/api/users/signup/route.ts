import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

// Custom JSON serializer to handle BigInt fields
const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export async function GET() {
  try {
    const users = await prisma.users.findMany();
    
    // Serialize the BigInt values to strings before sending the response
    const serializedUsers = users.map(user => JSON.parse(json(user))); // Deserialize back to object
    
    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching users." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { email, password, username } = await request.json();

  // Validate input
  if (!email || !password || !username) {
    return NextResponse.json(
      { error: "Email, username, and password are required." },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findFirst({
        where: { email },
      });

      if (existingUser) {
        // User exists, check password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Serialize BigInt fields before sending user data in response
        const serializedUser = JSON.parse(json(existingUser)); // Deserialize back to object

        return { message: "Login successful", user: serializedUser };
      } else {
        // User doesn't exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
            username,
            company_id: Number(randomInt(1, 33)), // Generate company_id between 1 and 32
            created_at: new Date(), // Current timestamp
            created_by: Number(Date.now()), // Unix timestamp in milliseconds
            updated_at: new Date(),
            updated_by: Number(Date.now()),
            username_secondary: "",
            phone: "",
            language_id_default_choice: null,
            is_active: true,
            is_approved: true,
            is_default_user: true,
            is_lock: false,
            is_temporary_password: false,
            role_id: Number(randomInt(1, 20)), // Generate role_id between 1 and 19
          },
        });

        // Serialize BigInt fields before sending user data in response
        const serializedNewUser = JSON.parse(json(newUser)); // Deserialize back to object

        return { message: "Signup successful", user: serializedNewUser };
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
