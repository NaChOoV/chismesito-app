import { EyeIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useMapContext } from '../../../context/MapContext';
import { useGossipContext } from '../../../context/GossipContext';

export default function FetchButton() {
    const { mapInstance, setNewPosition } = useMapContext();
    const { fetchGossips } = useGossipContext();

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                aria-label="Submit"
                className="animate-pulse-eye w-10 h-10 rounded-full border-2 cursor-pointer"
                onClick={() => {
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
        </>
    );
}
