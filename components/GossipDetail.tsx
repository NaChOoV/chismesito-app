import { X, Flag, Send, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GossipType } from '@/src/db/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGossipContext } from '../context/GossipContext';
import { useEffect, useRef } from 'react';

interface GossipDetailProps {
    gossip: GossipType;
    onClose: () => void;
}

const commentSchema = z.object({
    comment: z
        .string()
        .min(1, 'El comentario debe tener al menos 1 caracter.')
        .max(50, 'El comentario debe tener como máximo 50 caracteres.'),
});

const options = {
    day: '2-digit', // OK
    month: '2-digit', // OK
    year: 'numeric', // OK
    hour: '2-digit', // OK
    minute: '2-digit', // OK
    second: '2-digit', // OK
    hour12: true, // OK
} as Intl.DateTimeFormatOptions;

export function GossipDetail({ gossip, onClose }: GossipDetailProps) {
    const { createComment, fetchComments, comments, clearComments, loadingComments } =
        useGossipContext();
    const hasFetched = useRef(false);

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: '',
        },
    });

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchComments(gossip.id);
    }, [gossip.id, fetchComments]);

    function onSubmit(data: z.infer<typeof commentSchema>) {
        createComment(gossip.id, data.comment);
        form.reset();
    }

    return (
        <div
            className="w-[300px] sm:w-[350px] bg-white rounded-lg overflow-hidden p-1"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div className="pt-1 pl-1">
                    <h3 className="font-bold text-lg leading-none mb-1">{gossip.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2! mb-2!">
                        {gossip.description}
                    </p>
                </div>
                <div className="flex gap-1 shrink-0">
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Flag className="h-4 w-4" />
                    </Button> */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearComments();
                            onClose();
                        }}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="pl-1 pr-1">
                <h4 className="font-bold text-sm mb-2 text-gray-950">Comentarios</h4>
                <div
                    className={`overflow-y-auto pr-3 space-y-3 custom-scrollbar transition-all duration-300 ease-in-out ${
                        comments.length > 4 ? 'h-[150px]' : 'min-h-5 max-h-[150px]'
                    }`}
                >
                    {loadingComments && comments.length === 0 ? (
                        <div className="flex justify-center items-center h-full py-4">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-2 items-start mb-0 animate-fadeIn"
                            >
                                <div className="mt-0.5 shrink-0">
                                    <User className="h-4 w-4 text-gray-400 stroke-[1.5]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm text-gray-950 leading-tight wrap-break-word m-0!">
                                        {comment.description}
                                    </p>
                                    <p className="text-[10px] font-light m-0!">
                                        {comment.createdAt
                                            ? new Date(comment.createdAt).toLocaleTimeString(
                                                  'es-ES',
                                                  options
                                              )
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic m-0! animate-fadeIn">
                            Sin comentarios.
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Input */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2 mt-4 pt-3 border-t border-gray-100"
            >
                <div className="flex-1">
                    <Input
                        {...form.register('comment')}
                        placeholder="Comenta aquí"
                        className={`text-sm bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 ${
                            form.formState.errors.comment
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                        }`}
                        autoComplete="off"
                    />
                    {form.formState.errors.comment && (
                        <p className="text-[10px] text-red-500 mt-1 ml-1">
                            {form.formState.errors.comment.message}
                        </p>
                    )}
                </div>
                <Button type="submit" size="icon" className="cursor-pointer shrink-0">
                    <Send className="h-4 w-4 -ml-0.5 mt-0.5" />
                </Button>
            </form>
        </div>
    );
}
