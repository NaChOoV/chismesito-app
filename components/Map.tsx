'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap, useMapContext } from '@/context/MapContext';
import { GossipForm } from './GossipForm';
import './map-popup.css';
import { useGossipContext } from '../context/GossipContext';
import GossipTooltip from './GossipTooltip';

const MAP_CENTER: [number, number] = [-23.65, -70.4];
const CITY_BOUNDS: [[number, number], [number, number]] = [
    [-23.9, -70.6], // Suroeste
    [-23.4, -70.2], // Noreste
];

const MapComponent = () => {
    return (
        <>
            <MapContainer
                center={MAP_CENTER}
                zoom={13}
                style={{
                    height: '100dvh',
                    width: '100dvw',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                }}
                maxBounds={CITY_BOUNDS}
                attributionControl={false}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                touchZoom={true}
                dragging={true}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
                zoomSnap={0.25}
                zoomDelta={20}
            >
                <MapContent />
            </MapContainer>
        </>
    );
};

function MapContent() {
    const { newPosition: position } = useMapContext();
    const { gossips } = useGossipContext();
    useMap();

    const popupPosition = useMemo(
        () => (position ? [position[1], position[0]] : null),
        [position]
    );

    return (
        <>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                minZoom={11}
                maxZoom={20}
                keepBuffer={20}
            />

            {gossips.map((gossip) => (
                <GossipTooltip key={gossip.id} gossip={gossip} />
            ))}

            {popupPosition && (
                <Popup
                    position={popupPosition as [number, number]}
                    closeButton={false}
                    maxWidth={500}
                    minWidth={320}
                    className="custom-popup"
                >
                    <GossipForm />
                </Popup>
            )}
        </>
    );
}

export default MapComponent;
