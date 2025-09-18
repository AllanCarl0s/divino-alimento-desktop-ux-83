import React from 'react';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeafIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4', 
  lg: 'w-5 h-5'
};

export const LeafIcon = ({ className, size = 'md' }: LeafIconProps) => {
  return (
    <Leaf 
      className={cn(
        sizeClasses[size],
        'text-accent',
        className
      )} 
    />
  );
};

export default LeafIcon;