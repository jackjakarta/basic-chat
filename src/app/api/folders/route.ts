import { dbGetFoldersByUserId } from '@/db/functions/folder';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  const folders = await dbGetFoldersByUserId({ userId: user.id });

  return NextResponse.json({ folders });
}
