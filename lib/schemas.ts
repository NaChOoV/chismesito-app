import { z } from 'zod';

export const boundsQueryParamSchema = z.object({
    swLng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
    swLat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
    neLng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
    neLat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
});

export const newGossipSchema = z.object({
    title: z.string().min(1).max(30),
    description: z.string().max(100).optional().or(z.null()),
    location: z.object({
        x: z.number().min(-180).max(180),
        y: z.number().min(-90).max(90),
    }),
});

export const getCommentsSchema = z.object({
    gossipId: z.string().transform(Number).pipe(z.number().min(1)),
});

export const newCommentSchema = z.object({
    gossipId: z.number().min(1),
    description: z.string().min(1).max(50),
});
