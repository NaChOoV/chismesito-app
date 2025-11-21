import { EyeIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useMapContext } from '../../../context/MapContext';
import { useGossipContext } from '../../../context/GossipContext';
import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function FetchButton() {
    const { mapInstance, setNewPosition } = useMapContext();
    const { fetchGossips } = useGossipContext();
    const [isOpen, setIsOpen] = useState(true);
    const [hasBeenClicked, setHasBeenClicked] = useState(false);

    return (
        <Tooltip
            open={isOpen}
            onOpenChange={(open) => {
                if (hasBeenClicked) setIsOpen(open);
            }}
        >
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Submit"
                    className="animate-pulse-eye w-10 h-10 rounded-full border-2 cursor-pointer"
                    onClick={() => {
                        setIsOpen(false);
                        setHasBeenClicked(true);
                        if (mapInstance) {
                            const bounds = mapInstance.getBounds();
                            const boundsData = {
                                southWest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
                                northEast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
                            };
                            setNewPosition(undefined);
                            fetchGossips(boundsData);
                        }
                    }}
                >
                    <EyeIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p className="bold">Click para escanear chismes</p>
            </TooltipContent>
        </Tooltip>
    );
}
