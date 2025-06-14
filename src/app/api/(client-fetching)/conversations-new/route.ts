import { db } from '@/db';
import { conversationTable } from '@/db/schema';
import { getUser } from '@/utils/auth';
import { and, desc, eq, lt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await getUser();

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const PAGE_SIZE = 10;

  const page = await db
    .select()
    .from(conversationTable)
    .where(
      and(
        cursor ? lt(conversationTable.id, cursor) : undefined,
        eq(conversationTable.userId, user.id),
      ),
    )
    .orderBy(desc(conversationTable.updatedAt))
    .limit(PAGE_SIZE + 1);

  const hasMore = page.length > PAGE_SIZE;
  const items = hasMore ? page.slice(0, PAGE_SIZE) : page;

  return NextResponse.json({
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
  });
}
