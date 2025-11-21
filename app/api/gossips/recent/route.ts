import { gossip } from '@/src/db/schema';
import { db } from '@/src/db/drizzle';
import { desc } from 'drizzle-orm';

export async function GET() {
    const response = await db.select().from(gossip).orderBy(desc(gossip.updatedAt)).limit(15);

    return Response.json(response, { status: 200 });
}
