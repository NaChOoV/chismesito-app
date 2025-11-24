import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    useEffect,
    useCallback,
} from 'react';
import { useMapEvents } from 'react-leaflet';
import { useGossipContext } from './GossipContext';

const MIN_ZOOM = 16;

interface MapContextType {
    zoom: number;
    mapInstance: L.Map | null;
    newPosition: [number, number] | undefined;
    setZoom: (zoom: number) => void;
    setMapInstance: (map: L.Map) => void;
    setNewPosition: (position: [number, number] | undefined) => void;
    flyToPosition: (position: [number, number]) => void;
    canSeeGossip: boolean;
    minZoom: number;
}

export type MapBounds = {
    southWest: number[];
    northEast: number[];
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
    const [zoom, setZoom] = useState(13);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [newPosition, setNewPosition] = useState<[number, number] | undefined>(undefined);

    const flyToPosition = useCallback(
        (position: [number, number]) => {
            if (!mapInstance) return;
            mapInstance.flyTo({ lat: position[1], lng: position[0] }, 18);
        },
        [mapInstance]
    );

    const contextValue = useMemo(
        () => ({
            zoom,
            mapInstance,
            newPosition,
            setZoom,
            setMapInstance,
            setNewPosition,
            flyToPosition,
            canSeeGossip: zoom >= MIN_ZOOM,
            minZoom: MIN_ZOOM,
        }),
        [zoom, mapInstance, newPosition, flyToPosition]
    );

    return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
}

export function useMapContext() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext debe ser usado dentro de MapProvider');
    }
    return context;
}

/**
 * Be careful this hooks have to be inside Leaflet MapContainer to listen to zoom events
 * and update the context automatically
 */
export function useMap() {
    const { setZoom, setMapInstance, setNewPosition, canSeeGossip, newPosition } = useMapContext();
    const { selectedGossipId, setSelectedGossip } = useGossipContext();

    const map = useMapEvents({
        zoomend: () => {
            setZoom(map.getZoom());
        },
        click: (e) => {
            if (!canSeeGossip) return;
            if (selectedGossipId) {
                setSelectedGossip(undefined);
                return;
            }

            if (newPosition) {
                setNewPosition(undefined);
                return;
            }

            map.flyTo(e.latlng, map.getZoom());

            setNewPosition([e.latlng.lng, e.latlng.lat]);
        },
    });

    // Save the map instance one
    useEffect(() => {
        setMapInstance(map);
    }, [map, setMapInstance]);
}
