import React, { useState } from "react";
import { DndContext, DragOverlay, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { RelativeInput } from "@/components/RelativeInput";
import { NameSearch } from "@/components/NameSearch";
import { NameBuilder } from "@/components/NameBuilder";
import { NameCard } from "@/components/NameCard";
import { NameData } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [lastName, setLastName] = useState('');
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

  // Get relatives honored by selected names
  const getHonoredRelatives = () => {
    const honored = new Set<string>();
    const names = [firstName, middleName, hebrewName].filter(Boolean);
    
    names.forEach(name => {
      if (name) {
        const initial = name.english.charAt(0).toUpperCase();
        const matchedRelative = relatives.find(r => r.name.charAt(0).toUpperCase() === initial);
        if (matchedRelative) {
          honored.add(matchedRelative.name);
        }
      }
    });
    
    return Array.from(honored);
  };

  const honoredRelatives = getHonoredRelatives();

  const getMeanings = () => {
    const meanings = [];
    if (firstName) meanings.push(firstName.meaning);
    if (middleName) meanings.push(middleName.meaning);
    if (hebrewName) meanings.push(hebrewName.meaning);
    return meanings;
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen pb-20 px-4 md:px-8 pt-8">
        
        <header className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-3">Ledor Vador</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            "From Generation to Generation"
          </p>
          <div className="h-1 w-24 bg-secondary mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-8">
          
          {/* Left Sidebar - Relatives and Search */}
          <div className="space-y-6">
            <RelativeInput relatives={relatives} setRelatives={setRelatives} />
            
            <div className="h-[650px] bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm flex flex-col">
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

            {/* Last Name Input */}
            <Card className="bg-white/60 backdrop-blur-md border-white/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-semibold">Family Name (Optional)</Label>
                  <Input 
                    id="last-name"
                    placeholder="e.g. Cohen, Rosenberg, Levi..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white/50 border-primary/10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Full Name Preview - Always Visible */}
            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Your Baby's Full Name</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Full English Name */}
                <div className="text-center pb-4 border-b border-primary/10">
                  <div className="text-4xl md:text-5xl font-serif text-primary font-bold mb-2">
                    {firstName?.english ? `${firstName.english} ${middleName?.english || ''}`.trim() : 'First'} {lastName}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Full English Name</div>
                </div>

                {/* Hebrew Name */}
                {hebrewName && (
                  <div className="text-center pb-4 border-b border-primary/10">
                    <div className="text-3xl md:text-4xl text-secondary-foreground font-serif" style={{ direction: 'rtl' }}>
                      {hebrewName.hebrew}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Hebrew Name for Religious Use</div>
                  </div>
                )}

                {/* Meanings */}
                {getMeanings().length > 0 && (
                  <div className="pb-4 border-b border-primary/10">
                    <h4 className="text-sm font-bold uppercase text-primary mb-3 tracking-wider">Combined Meaning</h4>
                    <div className="space-y-2">
                      {getMeanings().map((meaning, i) => (
                        <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span>{meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Honored Relatives */}
                {honoredRelatives.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase text-primary mb-3 tracking-wider">Honoring Their Memory</h4>
                    <div className="space-y-2">
                      {honoredRelatives.map((relative, i) => (
                        <div key={i} className="text-sm text-secondary-foreground flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/20">
                          <span className="w-2 h-2 rounded-full bg-secondary" />
                          {relative}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!firstName && !middleName && !hebrewName && !lastName && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Select names and enter a family name to see the full preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
