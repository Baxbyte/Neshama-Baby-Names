import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NameData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NameCardProps {
  name: NameData;
  source?: 'search' | 'builder';
  honoring?: string | null;
}

export function NameCard({ name, source = 'search', honoring }: NameCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: name.id,
    data: { name, source },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200 border border-border/40",
        isDragging && "opacity-50 rotate-2 scale-105 z-50",
        source === 'builder' ? "bg-white" : "bg-white/80 hover:bg-white"
      )}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
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
      </CardContent>
    </Card>
  );
}
