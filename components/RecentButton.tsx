import { Clock10Icon } from 'lucide-react';
import { Button } from './ui/button';

export default function RecentButton() {
    return (
        <Button
            variant="outline"
            size="icon"
            aria-label="Submit"
            className="w-10 h-10 cursor-pointer"
            onClick={() => {}}
        >
            <Clock10Icon />
        </Button>
    );
}
