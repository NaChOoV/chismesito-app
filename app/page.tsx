'use client';

import { MapProvider } from '@/context/MapContext';
import LeftPanel from '../components/panels/LeftPanel/LeftPanel';
import { GossipsProvider } from '../context/GossipContext';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100dvh', width: '100dvw' }} />,
});

export default function Home() {
    return (
        <MapProvider>
            <GossipsProvider>
                <LeftPanel />
                <Map />
            </GossipsProvider>
        </MapProvider>
    );
}
