import React, { useState } from "react";
import { DndContext, DragOverlay, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Link } from "wouter";
import { RelativeInput } from "@/components/RelativeInput";
import { NameSearch } from "@/components/NameSearch";
import { NameBuilder } from "@/components/NameBuilder";
import { NameCard } from "@/components/NameCard";
import { Footer } from "@/components/Footer";
import { NameData } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/lib/context";

interface LocalSavedName {
  id: string;
  firstName: string;
  middleName: string;
  hebrewName: string;
  lastName: string;
  firstNameHebrew: string;
  hebrewNameHebrew: string;
  savedAt: string;
}

const SAVED_NAMES_KEY = "neshama-saved-names";

export default function Home() {
  const {
    relatives,
    setRelatives,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    hebrewName,
    setHebrewName,
    lastName,
    setLastName,
  } = useAppState();
  
  const [activeDragItem, setActiveDragItem] = useState<NameData | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

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

  const saveName = () => {
    if (!firstName && !middleName && !hebrewName && !lastName) {
      toast.error("Please select at least one name to save");
      return;
    }

    const newSavedName: LocalSavedName = {
      id: crypto.randomUUID(),
      firstName: firstName?.english || 'First',
      middleName: middleName?.english || '',
      hebrewName: hebrewName?.english || '',
      lastName: lastName || '',
      firstNameHebrew: firstName?.hebrew || '',
      hebrewNameHebrew: hebrewName?.hebrew || '',
      savedAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem(SAVED_NAMES_KEY);
    const savedNames: LocalSavedName[] = existing ? JSON.parse(existing) : [];
    savedNames.unshift(newSavedName);
    localStorage.setItem(SAVED_NAMES_KEY, JSON.stringify(savedNames));

    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
    toast.success("Name idea saved!");
  };

  const handleAddName = (name: NameData, type: 'first' | 'middle' | 'hebrew') => {
    if (type === 'first') setFirstName(name);
    if (type === 'middle') setMiddleName(name);
    if (type === 'hebrew') setHebrewName(name);
    
    // Optional: Scroll to the builder on mobile
    if (window.innerWidth < 768) {
      const builder = document.getElementById('name-builder');
      builder?.scrollIntoView({ behavior: 'smooth' });
    }
    
    toast.success(`Added ${name.english} as ${type} name`);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen pb-20 px-4 md:px-8 pt-8">
        
        <header className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-3">Neshama Baby Names</h1>
          <div className="h-1 w-24 bg-secondary mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-8">
          
          {/* Left Sidebar - Relatives and Search */}
          <div className="space-y-6">
            <RelativeInput relatives={relatives} setRelatives={setRelatives} />
            
            <div className="h-[650px] bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm flex flex-col">
              <NameSearch relatives={relatives} onAddName={handleAddName} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-8" id="name-builder">
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

            {/* Save and View Buttons */}
            <div className="flex gap-4 items-center justify-center">
              <Button
                onClick={saveName}
                className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all hover:shadow-lg flex items-center gap-2"
                data-testid="button-save-name"
              >
                <BookmarkPlus className="w-5 h-5" />
                Save Name Idea
              </Button>
              <Link href="/saved">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg"
                  data-testid="link-saved-names"
                >
                  <BookmarkCheck className="w-5 h-5 mr-2" />
                  View Saved Names
                </Button>
              </Link>
            </div>

            {/* Save Confirmation Toast - appears briefly */}
            {showSaveConfirmation && (
              <div 
                className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4"
                onClick={() => setShowSaveConfirmation(false)}
              >
                <Card className="bg-gradient-to-r from-secondary to-green-500 border-none shadow-xl">
                  <CardContent className="py-4 px-8 flex items-center gap-3 text-white">
                    <BookmarkCheck className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">Name idea saved successfully!</span>
                  </CardContent>
                </Card>
              </div>
            )}

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
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Ashkenazi tradition typically honors deceased relatives to keep their memory alive. 
                    Sephardic tradition often honors living grandparents as a sign of respect and continuity.
                    Consider the meaning of the name and the character of the person you are honoring.
                  </p>
                  <div className="pt-4 border-t border-primary/10">
                    <p className="font-serif text-primary italic">Ledor Vador</p>
                    <p className="text-xs text-muted-foreground">"From Generation to Generation"</p>
                  </div>
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

      <Footer />

    </DndContext>
  );
}
