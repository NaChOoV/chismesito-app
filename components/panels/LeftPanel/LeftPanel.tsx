'use client';

import { useMapContext } from '../../../context/MapContext';
import RecentButton from './RecentButton';
import FetchButton from './FetchButton';
import ZoomNotification from './ZoomNotification';

export default function LeftPanel() {
    const { canSeeGossip: canSeeChismes } = useMapContext();

    return (
        <div className="absolute flex flex-col top-16 bottom-8 left-8 z-50 gap-4 pointer-events-none">
            <div className="pointer-events-auto">
                <RecentButton />
            </div>
            {canSeeChismes && (
                <div className="pointer-events-auto">
                    <FetchButton />
                </div>
            )}
            <div className="mt-auto pointer-events-auto">
                <ZoomNotification />
            </div>
        </div>
    );
}
