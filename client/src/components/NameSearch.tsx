import React, { useState } from 'react';
import { NAMES, NameData } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NameCard } from './NameCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Relative {
  id: string;
  name: string;
  relation: string;
}

interface NameSearchProps {
  relatives: Relative[];
  onAddName?: (name: NameData, type: 'first' | 'middle' | 'hebrew') => void;
}

export function NameSearch({ relatives, onAddName }: NameSearchProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');
  const [nameType, setNameType] = useState<'english' | 'hebrew'>('english');

  const relativeInitials = relatives.map(r => r.name.charAt(0).toUpperCase());

  const filteredNames = NAMES.filter((name) => {
    // Filter by name type (English vs Hebrew)
    if (name.nameType !== nameType) return false;

    // Search logic - always search in both fields for flexibility
    const matchesQuery = 
      name.english.toLowerCase().includes(query.toLowerCase()) || 
      name.hebrew.includes(query) ||
      name.transliteration.toLowerCase().includes(query.toLowerCase()) ||
      name.meaning.toLowerCase().includes(query.toLowerCase());
    
    const matchesFilter = filter === 'all' || name.gender === filter || name.gender === 'neutral';
    return matchesQuery && matchesFilter;
  });

  // Sort: Names matching relative initials first, then alphabetically
  const sortedNames = [...filteredNames].sort((a, b) => {
    const aMatch = relativeInitials.includes(a.english.charAt(0).toUpperCase());
    const bMatch = relativeInitials.includes(b.english.charAt(0).toUpperCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return a.english.localeCompare(b.english);
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-3">
        <h2 className="text-xl font-serif text-primary">Discover Names</h2>
        
        <div className="flex gap-2 w-full overflow-hidden">
          <Button 
            onClick={() => setNameType('english')}
            variant={nameType === 'english' ? 'default' : 'outline'}
            className={`flex-1 text-xs sm:text-sm min-w-0 px-2 sm:px-4 ${nameType === 'english' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}`}
            size="sm"
          >
            English
          </Button>
          <Button 
            onClick={() => setNameType('hebrew')}
            variant={nameType === 'hebrew' ? 'default' : 'outline'}
            className={`flex-1 text-xs sm:text-sm min-w-0 px-2 sm:px-4 ${nameType === 'hebrew' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}`}
            size="sm"
          >
            Hebrew
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 bg-white/50 border-primary/10 focus-visible:ring-secondary" 
            placeholder={nameType === 'hebrew' ? "חיפוש בעברית..." : "Search by name..."} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            dir={nameType === 'hebrew' ? 'rtl' : 'ltr'}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="w-full bg-primary/5">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="female" className="flex-1">Girls</TabsTrigger>
            <TabsTrigger value="male" className="flex-1">Boys</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="grid grid-cols-1 gap-3 pb-4">
          {sortedNames.map((name) => {
             const honoredRelative = relatives.find(r => r.name.charAt(0).toUpperCase() === name.english.charAt(0));
             return (
               <NameCard 
                 key={name.id} 
                 name={name} 
                 honoring={honoredRelative ? honoredRelative.name : null}
                 onAdd={onAddName}
               />
             );
          })}
          {sortedNames.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No names found matching your search.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
