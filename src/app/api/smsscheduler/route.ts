import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sms_receiver = req.nextUrl.searchParams.get("sms_receiver");
  const sms_text = req.nextUrl.searchParams.get("sms_text");
  const user_id = req.nextUrl.searchParams.get("user_id");
  const user_password = req.nextUrl.searchParams.get("user_password");
  console.log(
    "sms_receiver:",
    sms_receiver,
    "sms_text:",
    sms_text,
    "user_id:",
    user_id,
    "user_password:",
    user_password
  );

  if (!sms_receiver || !sms_text || !user_id || !user_password) {
    return NextResponse.json(
      {
        error:
          "Missing required parameters (sms_receiver, sms_text, user_id, user_password)",
      },
      { status: 400 }
    );
  }

  try {
    await prisma.smsscheduler.create({
      data: {
        content: sms_text,
        receiver: sms_receiver,
        userId: user_id,
        userPass: user_password,
      },
    });

    return NextResponse.json(
      { message: "successfully error data inserted!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "data insert unsuccessfull" },
      { status: 400 }
    );
  }
}
