import { Button } from '../../ui/button';
import { useGossipContext } from '../../../context/GossipContext';
import { useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { useMapContext } from '../../../context/MapContext';

function getRelativeTime(date: Date | string) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ~${diffInMinutes} minutos`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ~${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ~${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
}

interface RecentGossipsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RecentGossipsDrawer({ open, onOpenChange }: RecentGossipsDrawerProps) {
    const { recentGossips, addGossips } = useGossipContext();
    const { flyToPosition } = useMapContext();

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent>
                <div className="mx-auto w-full max-w-md h-full flex flex-col">
                    <DrawerHeader className="flex justify-between items-start">
                        <div className="text-left">
                            <DrawerTitle>Últimos Chismes</DrawerTitle>
                            <DrawerDescription>(Actualizado cada 15 segundos)</DrawerDescription>
                        </div>
                    </DrawerHeader>
                    <div className="p-4 pt-0 space-y-4 overflow-y-auto flex-1">
                        {recentGossips.map((gossip) => (
                            <div
                                key={gossip.id}
                                className="border rounded-xl p-4 shadow-sm bg-card cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={(e) => {
                                    onOpenChange(false);
                                    flyToPosition([gossip.location.x, gossip.location.y]);
                                    addGossips([gossip]);
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    📢
                                    <h3 className="font-semibold leading-none tracking-tight">
                                        {gossip.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {gossip.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {getRelativeTime(gossip.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
