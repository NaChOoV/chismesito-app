'use client';

import { ZoomInIcon, EyeIcon } from 'lucide-react';
import { useMapContext } from '@/context/MapContext';

export default function ZoomNotification() {
    const { canSeeGossip } = useMapContext();

    const message = canSeeGossip
        ? 'Puedes ver y agregar chismes'
        : 'Haz zoom para ver y agregar chismes';
    const backgroundColor = canSeeGossip ? 'bg-green-800' : 'bg-red-800';
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
            <div className={`text-white md:text-lg sm:text-sm`}>{message}</div>
        </div>
    );
}
