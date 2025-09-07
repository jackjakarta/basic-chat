import { dbGetChatProjectsByUserId } from '@/db/functions/chat-project';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  const chatProjects = await dbGetChatProjectsByUserId({ userId: user.id });

  return NextResponse.json({ chatProjects });
}
