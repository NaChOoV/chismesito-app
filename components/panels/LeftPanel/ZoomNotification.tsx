'use client';

import { ZoomInIcon, EyeIcon } from 'lucide-react';
import { useMapContext } from '@/context/MapContext';

export default function ZoomInfo() {
    const { canSeeGossip } = useMapContext();

    const message = canSeeGossip ? 'Puedes ver chismes' : 'Haz zoom para ver chismes';
    const textColor = canSeeGossip ? 'text-green-400' : 'text-red-400';
    const backgroundColor = canSeeGossip ? 'bg-green-800/50' : 'bg-red-800/50';
    const icon = canSeeGossip ? (
        <EyeIcon className="inline-block w-4 h-4 text-white" />
    ) : (
        <ZoomInIcon className="inline-block w-4 h-4 text-white" />
    );

    return (
        <div
            className={`${backgroundColor} px-4 py-1 rounded-md flex items-center align-middle gap-2`}
        >
            {icon}
            <div className={`${textColor} text-lg`}>{message}</div>
        </div>
    );
}
