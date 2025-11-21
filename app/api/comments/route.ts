import { NextRequest } from 'next/server';
import { getCommentsSchema, newCommentSchema } from '../../../lib/schemas';
import z from 'zod';
import { db } from '../../../src/db/drizzle';
import { comment } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());

    const validationResult = getCommentsSchema.safeParse(rawParams);
    if (!validationResult.success) {
        return Response.json(
            {
                error: 'Invalid query parameters',
                details: z.treeifyError(validationResult.error),
            },
            { status: 400 }
        );
    }

    const response = await db
        .select()
        .from(comment)
        .where(eq(comment.gossipId, validationResult.data.gossipId));

    return Response.json(response, { status: 200 });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validationResult = newCommentSchema.safeParse(body);
    if (!validationResult.success) {
        return Response.json(
            {
                error: 'Invalid request body',
                details: z.treeifyError(validationResult.error),
            },
            { status: 400 }
        );
    }

    const { gossipId, description } = validationResult.data;

    const response = await db
        .insert(comment)
        .values({
            gossipId: gossipId,
            description: description,
        })
        .returning();

    return Response.json(response[0], { status: 201 });
}
