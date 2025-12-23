import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { NameData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DroppableSlotProps {
  id: string;
  title: string;
  name: NameData | null;
  onRemove: () => void;
  isOver?: boolean;
}

function DroppableSlot({ id, title, name, onRemove, isOver }: DroppableSlotProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[150px]">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 text-center">{title}</div>
      <Card 
        className={cn(
          "h-32 border-dashed border-2 transition-all duration-300 flex items-center justify-center relative group overflow-hidden",
          isOver ? "border-secondary bg-secondary/10 scale-105 shadow-lg" : "border-primary/20 bg-white/40",
          name ? "border-solid border-primary/10 bg-white shadow-sm" : ""
        )}
      >
        {name ? (
          <div className="text-center p-4 w-full">
             <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
              >
                <X className="w-3 h-3" />
              </Button>
            <h3 className="text-xl font-serif text-primary font-bold">{name.english}</h3>
            <p className="text-lg text-secondary-foreground font-serif mt-1">{name.hebrew}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{name.meaning}</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground/40">
             <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
             <span className="text-sm">Drop Name Here</span>
          </div>
        )}
      </Card>
    </div>
  );
}

interface NameBuilderProps {
  firstName: NameData | null;
  middleName: NameData | null;
  hebrewName: NameData | null;
  setFirstName: (n: NameData | null) => void;
  setMiddleName: (n: NameData | null) => void;
  setHebrewName: (n: NameData | null) => void;
  activeId: string | null;
}

export function NameBuilder({ 
  firstName, middleName, hebrewName, 
  setFirstName, setMiddleName, setHebrewName,
  activeId 
}: NameBuilderProps) {
  
  // This is a simplification. In a real app we'd track "isOver" state via the global DndContext events 
  // passed down or via local useDroppable state if we were splitting this up differently.
  // For now, visual feedback relies on the `isOver` boolean passed from parent or handled by local drop hooks 
  // if we moved the hook logic here.
  // Actually, useDroppable provides `isOver` directly.

  const firstDrop = useDroppable({ id: 'first' });
  const middleDrop = useDroppable({ id: 'middle' });
  const hebrewDrop = useDroppable({ id: 'hebrew' });

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-sm border border-white/50">
      <h2 className="text-2xl font-serif text-primary text-center mb-6">Your Baby's Name</h2>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
        <DroppableSlot 
           id="first" 
           title="First Name" 
           name={firstName} 
           onRemove={() => setFirstName(null)}
           isOver={firstDrop.isOver}
        />
        <div ref={firstDrop.setNodeRef} className="hidden" /> {/* Hidden ref attachment if needed separately, but attached above */}
        
        <DroppableSlot 
           id="middle" 
           title="Middle Name" 
           name={middleName} 
           onRemove={() => setMiddleName(null)}
           isOver={middleDrop.isOver}
        />

        <div className="w-px bg-primary/10 mx-2 hidden md:block" />
        
        <DroppableSlot 
           id="hebrew" 
           title="Hebrew Name" 
           name={hebrewName} 
           onRemove={() => setHebrewName(null)}
           isOver={hebrewDrop.isOver}
        />
      </div>

      {(firstName || middleName || hebrewName) && (
        <div className="mt-8 text-center p-6 bg-primary/5 rounded-lg border border-primary/10 animate-in slide-in-from-bottom-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name Preview</p>
          <div className="text-3xl md:text-4xl font-serif text-primary mb-2">
            {firstName?.english} {middleName?.english}
          </div>
          <div className="text-xl text-secondary-foreground/80 font-serif dir-rtl" style={{ direction: 'rtl' }}>
             {hebrewName ? hebrewName.hebrew : (firstName?.hebrew || middleName?.hebrew)}
          </div>
          <div className="mt-4 pt-4 border-t border-primary/10 text-sm text-muted-foreground max-w-lg mx-auto">
             Meaning: {[firstName?.meaning, middleName?.meaning, hebrewName?.meaning].filter(Boolean).join(" • ")}
          </div>
        </div>
      )}
    </div>
  );
}
