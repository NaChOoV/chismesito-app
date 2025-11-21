import { NextRequest } from 'next/server';
import { boundsQueryParamSchema, newGossipSchema } from '@/lib/schemas';
import { db } from '@/src/db/drizzle';
import { gossip } from '@/src/db/schema';
import { sql } from 'drizzle-orm/sql/sql';
import z from 'zod';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());

    const validationResult = boundsQueryParamSchema.safeParse(rawParams);
    if (!validationResult.success) {
        return Response.json(
            {
                error: 'Invalid query parameters',
                details: z.treeifyError(validationResult.error),
            },
            { status: 400 }
        );
    }

    const validatedParams = validationResult.data;

    const { swLng, swLat, neLng, neLat } = validatedParams;
    const envelopeExpression = sql`ST_MakeEnvelope(${swLat}, ${swLng}, ${neLat}, ${neLng}, 4326)`;

    const response = await db
        .select()
        .from(gossip)
        .where(sql`ST_Within(ST_SetSRID(${gossip.location}, 4326), ${envelopeExpression})`);

    return Response.json(response, { status: 200 });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validationResult = newGossipSchema.safeParse(body);

    if (!validationResult.success) {
        return Response.json(
            {
                error: 'Invalid request body',
                details: validationResult.error.flatten(),
            },
            { status: 400 }
        );
    }

    const validatedBody = validationResult.data;

    const response = await db
        .insert(gossip)
        .values({
            title: validatedBody.title,
            description: validatedBody.description,
            location: {
                x: validatedBody.location.x,
                y: validatedBody.location.y,
            },
        })
        .returning();

    // Process the validated body as needed
    return Response.json(response[0], { status: 201 });
}
