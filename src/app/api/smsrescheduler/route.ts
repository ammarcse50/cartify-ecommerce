import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    const sms_receiver = req.nextUrl.searchParams.get('sms_receiver');
    const sms_text = req.nextUrl.searchParams.get('sms_text');
    const user_id = req.nextUrl.searchParams.get('user_id');
    const user_password = req.nextUrl.searchParams.get('user_password');
    console.log("sms_receiver:", sms_receiver, "sms_text:", sms_text, "user_id:", user_id, "user_password:", user_password);

    if (!sms_receiver || !sms_text || !user_id || !user_password) {
        return NextResponse.json(
            { error: 'Missing required parameters (sms_receiver, sms_text, user_id, user_password)' },
            { status: 400 }
        );
    }


}