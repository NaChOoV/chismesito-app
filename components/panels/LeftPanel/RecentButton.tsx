import { Clock10Icon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect, useState, useRef } from 'react';
import RecentGossipsDrawer from '../RightPanel/RecentGossipsDrawer';
import { useGossipContext } from '../../../context/GossipContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

export default function RecentButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const { fetchRecentGossips, recentGossips } = useGossipContext();
    const lastGossipIdRef = useRef<number | null>(null);

    useEffect(() => {
        fetchRecentGossips();
        const interval = setInterval(() => {
            fetchRecentGossips();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchRecentGossips]);

    useEffect(() => {
        if (recentGossips.length === 0) return;

        const latestId = recentGossips[0].id;
        const lastId = lastGossipIdRef.current;

        if (lastId !== null && latestId !== lastId) {
            setTimeout(() => {
                setIsTooltipOpen(true);
                setTimeout(() => setIsTooltipOpen(false), 5000);
            }, 0);
        }

        lastGossipIdRef.current = latestId;
    }, [recentGossips]);

    return (
        <>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Recent Gossips"
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => {
                            setIsOpen(true);
                            setIsTooltipOpen(false);
                        }}
                    >
                        <Clock10Icon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p className="bold">Nuevos Chismes!</p>
                </TooltipContent>
            </Tooltip>
            <RecentGossipsDrawer open={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}
