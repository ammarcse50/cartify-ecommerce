import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {

  const cookieStore = cookies();
  (await cookieStore).delete('token'); 

  return NextResponse.json({ message: 'Logged out successfully' });
}