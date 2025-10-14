import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusToggleProps {
  currentStatus: 'Ativo' | 'Inativo';
  onStatusChange: (newStatus: 'Ativo' | 'Inativo') => Promise<void>;
  disabled?: boolean;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: 'Ativo' | 'Inativo') => {
    if (newStatus === localStatus || isUpdating) return;

    const previousStatus = localStatus;
    setLocalStatus(newStatus);
    setIsUpdating(true);

    try {
      await onStatusChange(newStatus);
    } catch (error) {
      // Reverter em caso de erro
      setLocalStatus(previousStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  if (disabled) {
    return (
      <Badge variant={localStatus === 'Ativo' ? 'success' : 'warning'}>
        {localStatus}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isUpdating}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          localStatus === 'Ativo'
            ? "border-transparent bg-green-600 text-white hover:bg-green-700"
            : "border-transparent bg-orange-500 text-white hover:bg-orange-600",
          isUpdating && "opacity-70 cursor-wait"
        )}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            {localStatus}
            <ChevronDown className="w-3 h-3" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-popover">
        <DropdownMenuItem
          onClick={() => handleStatusChange('Ativo')}
          className={cn(
            "cursor-pointer",
            localStatus === 'Ativo' && "bg-accent"
          )}
        >
          Ativo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('Inativo')}
          className={cn(
            "cursor-pointer",
            localStatus === 'Inativo' && "bg-accent"
          )}
        >
          Inativo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
