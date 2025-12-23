import React, { useState } from "react";
import { DndContext, DragOverlay, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { RelativeInput } from "@/components/RelativeInput";
import { NameSearch } from "@/components/NameSearch";
import { NameBuilder } from "@/components/NameBuilder";
import { NameCard } from "@/components/NameCard";
import { NameData } from "@/lib/data";

interface Relative {
  id: string;
  name: string;
  relation: string;
}

export default function Home() {
  const [relatives, setRelatives] = useState<Relative[]>([]);
  const [firstName, setFirstName] = useState<NameData | null>(null);
  const [middleName, setMiddleName] = useState<NameData | null>(null);
  const [hebrewName, setHebrewName] = useState<NameData | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<NameData | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current?.name);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveDragItem(null);

    if (!over) return;

    const nameData = active.data.current?.name as NameData;
    
    if (over.id === 'first') setFirstName(nameData);
    if (over.id === 'middle') setMiddleName(nameData);
    if (over.id === 'hebrew') setHebrewName(nameData);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen pb-20 px-4 md:px-8 pt-8">
        
        <header className="max-w-6xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-3">Ledor Vador</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            "From Generation to Generation"
          </p>
          <div className="h-1 w-24 bg-secondary mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          
          {/* Left Sidebar */}
          <div className="space-y-6">
            <RelativeInput relatives={relatives} setRelatives={setRelatives} />
            
            <div className="h-[600px] bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm flex flex-col">
              <NameSearch relatives={relatives} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            <NameBuilder 
              firstName={firstName} 
              setFirstName={setFirstName}
              middleName={middleName} 
              setMiddleName={setMiddleName}
              hebrewName={hebrewName} 
              setHebrewName={setHebrewName}
              activeId={activeDragItem ? activeDragItem.id : null}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                  <h3 className="font-serif text-lg text-primary mb-2">Naming Traditions</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ashkenazi tradition typically honors deceased relatives to keep their memory alive. 
                    Sephardic tradition often honors living grandparents as a sign of respect and continuity.
                    Consider the meaning of the name and the character of the person you are honoring.
                  </p>
               </div>
               <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20">
                  <h3 className="font-serif text-lg text-secondary-foreground mb-2">Did you know?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Hebrew name is used for religious rituals, calling to the Torah, and the Ketubah. 
                    It is the spiritual essence of the person.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <DragOverlay>
        {activeDragItem ? (
          <div className="w-[300px]">
            <NameCard name={activeDragItem} source="search" />
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}
