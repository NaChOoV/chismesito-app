import { Marker, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GossipType } from '../src/db/schema';
import { GossipDetail } from './GossipDetail';
import { memo, useMemo } from 'react';
import { useGossipContext } from '../context/GossipContext';

const invisibleIcon = L.divIcon({
    className: 'display-none',
});

const GossipTooltip = memo(function GossipTooltip({ gossip }: { gossip: GossipType }) {
    const { selectedGossipId, setSelectedGossip } = useGossipContext();

    const isSelected = useMemo(() => selectedGossipId === gossip.id, [selectedGossipId, gossip.id]);

    return (
        <>
            <Marker
                key={gossip.id}
                position={[gossip.location.y, gossip.location.x]}
                icon={invisibleIcon}
            >
                <Tooltip
                    permanent
                    direction="top"
                    className="bg-card! text-card-foreground! border! font-semibold cursor-pointer shadow-md!"
                    interactive
                >
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setSelectedGossip(gossip.id);
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setSelectedGossip(gossip.id);
                        }}
                    >
                        {gossip.title}
                    </div>
                </Tooltip>
            </Marker>

            {isSelected && (
                <Popup
                    position={[gossip.location.y, gossip.location.x]}
                    closeButton={false}
                    className="m-0!"
                    maxWidth={350}
                    minWidth={300}
                    autoPanPadding={[50, 50]}
                    offset={[0, -50]}
                >
                    <GossipDetail gossip={gossip} onClose={() => setSelectedGossip(undefined)} />
                </Popup>
            )}
        </>
    );
});

export default GossipTooltip;
