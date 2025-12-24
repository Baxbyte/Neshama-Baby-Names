import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NameData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NameCardProps {
  name: NameData;
  source?: 'search' | 'builder';
  honoring?: string | null;
  onAdd?: (name: NameData, type: 'first' | 'middle' | 'hebrew') => void;
}

export function NameCard({ name, source = 'search', honoring, onAdd }: NameCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: name.id,
    data: { name, source },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // We only want the drag listeners on the grip icon for better mobile experience
  // or on the card itself if not using the add button
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-200 border border-border/40 relative",
        isDragging && "opacity-50 rotate-2 scale-105 z-50",
        source === 'builder' ? "bg-white" : "bg-white/80 hover:bg-white"
      )}
    >
      <CardContent className="p-3 flex items-center gap-3">
        {/* Drag Handle - Only element with drag listeners */}
        <div 
          {...listeners} 
          {...attributes} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-muted rounded-md touch-none"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <h4 className="font-bold text-lg text-primary truncate leading-none">{name.english}</h4>
            <span className="font-serif text-lg text-secondary-foreground/80 leading-none">{name.hebrew}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1">{name.meaning}</p>
          {honoring && (
            <p className="text-xs text-secondary-foreground font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Honoring {honoring}
            </p>
          )}
        </div>

        {/* Mobile-friendly Add Button */}
        {source === 'search' && onAdd && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0">
                <Plus className="w-4 h-4 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAdd(name, 'first')}>
                Add as First Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdd(name, 'middle')}>
                Add as Middle Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdd(name, 'hebrew')}>
                Add as Hebrew Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
}
