'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CommentType, GossipType } from '../src/db/schema';
import { MapBounds, useMapContext } from './MapContext';
import { set } from 'zod';

type NewGossip = Omit<GossipType, 'id' | 'createdAt' | 'updatedAt'>;

interface GossipsContextType {
    gossips: GossipType[];
    recentGossips: GossipType[];
    comments: CommentType[];
    loading: boolean;
    error: string | null;
    // API CALLS
    createGossip: (gossip: NewGossip) => Promise<void>;
    fetchGossips: (mapBounds: MapBounds) => Promise<void>;
    fetchRecentGossips: () => Promise<void>;
    createComment: (gossipId: number, text: string) => Promise<void>;
    fetchComments: (gossipId: number) => Promise<void>;

    // INTERNAL STATE
    addGossips: (gossips: GossipType[]) => void;
    clearGossips: () => void;
    clearComments: () => void;
}

const GossipsContext = createContext<GossipsContextType | undefined>(undefined);
export function GossipsProvider({ children }: { children: React.ReactNode }) {
    const [gossips, setGossips] = useState<GossipType[]>([]);
    const [recentGossips, setRecentGossips] = useState<GossipType[]>([]);

    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setNewPosition } = useMapContext();

    const addGossips = useCallback((newGossips: GossipType[]) => {
        setGossips((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const uniqueNewGossips = newGossips.filter((g) => !existingIds.has(g.id));
            return [...prev, ...uniqueNewGossips];
        });
    }, []);

    const clearGossips = useCallback(() => {
        setGossips([]);
    }, []);

    const clearComments = useCallback(() => {
        setComments([]);
    }, []);

    const fetchGossips = useCallback(
        async (mapBounds: MapBounds) => {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching gossips with bounds:', mapBounds);
                const response = await fetch(
                    `/api/gossips?swLng=${mapBounds.southWest[0]}&swLat=${mapBounds.southWest[1]}&neLng=${mapBounds.northEast[0]}&neLat=${mapBounds.northEast[1]}`
                );
                if (!response.ok) throw new Error('Error fetching gossips');

                const gossipsResponse = (await response.json()) as GossipType[];
                console.log('Gossips fetched:', gossipsResponse);

                clearGossips();
                addGossips(gossipsResponse);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        },
        [clearGossips, addGossips]
    );

    const fetchRecentGossips = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/gossips/recent`);
            if (!response.ok) throw new Error('Error fetching recent gossips');

            const gossipsResponse = (await response.json()) as GossipType[];
            setRecentGossips(gossipsResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    const createGossip = useCallback(
        async (gossip: NewGossip) => {
            setLoading(true);
            try {
                const response = await fetch('/api/gossips', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(gossip),
                });
                if (!response.ok) throw new Error('Error creating gossip');

                const newGossip = (await response.json()) as GossipType;

                addGossips([newGossip]);
                setNewPosition(undefined);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [addGossips, setNewPosition]
    );

    const createComment = useCallback(
        async (gossipId: number, description: string) => {
            setLoading(true);
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ gossipId, description }),
                });
                if (!response.ok) throw new Error('Error creating comment');

                const newComment = (await response.json()) as CommentType;

                setComments((prev) => [...prev, newComment]);
                setNewPosition(undefined);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [setComments, setNewPosition]
    );

    const fetchComments = useCallback(async (gossipId: number) => {
        setLoading(true);
        setComments([]);
        setError(null);
        try {
            const response = await fetch(`/api/comments?gossipId=${gossipId}`);
            if (!response.ok) throw new Error('Error fetching comments');

            const commentsResponse = (await response.json()) as CommentType[];
            setComments(commentsResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            gossips,
            recentGossips,
            comments,
            loading,
            error,
            // API CALLS
            fetchGossips,
            fetchRecentGossips,
            createGossip,
            createComment,
            fetchComments,
            // INTERNAL STATE
            addGossips,
            clearGossips,
            clearComments,
        }),
        [
            gossips,
            recentGossips,
            comments,
            loading,
            error,
            // API CALLS
            fetchGossips,
            fetchRecentGossips,
            createGossip,
            createComment,
            fetchComments,
            // INTERNAL STATE
            addGossips,
            clearGossips,
            clearComments,
        ]
    );

    return <GossipsContext.Provider value={contextValue}>{children}</GossipsContext.Provider>;
}

export function useGossipContext() {
    const context = useContext(GossipsContext);
    if (!context) {
        throw new Error('useGossips must be used within GossipsProvider');
    }
    return context;
}
