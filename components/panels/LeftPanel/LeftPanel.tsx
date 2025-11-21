'use client';

import { useMapContext } from '../../../context/MapContext';
import RecentButton from '../../RecentButton';
import FetchButton from './FetchButton';
import ZoomInfo from './ZoomNotification';

export default function LeftPanel() {
    const { canSeeGossip: canSeeChismes } = useMapContext();

    return (
        <div className="absolute flex flex-col top-16 bottom-8 left-8 z-50 gap-4">
            <RecentButton />
            {canSeeChismes && <FetchButton />}
            <div className="mt-auto">
                <ZoomInfo />
            </div>
        </div>
    );
}
