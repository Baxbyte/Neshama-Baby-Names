import React, { useState } from 'react';
import { NAMES, NameData } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NameCard } from './NameCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Relative {
  id: string;
  name: string;
  relation: string;
}

interface NameSearchProps {
  relatives: Relative[];
}

export function NameSearch({ relatives }: NameSearchProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');

  const relativeInitials = relatives.map(r => r.name.charAt(0).toUpperCase());

  const filteredNames = NAMES.filter((name) => {
    const matchesQuery = name.english.toLowerCase().includes(query.toLowerCase()) || 
                         name.hebrew.includes(query) ||
                         name.meaning.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || name.gender === filter || name.gender === 'neutral';
    return matchesQuery && matchesFilter;
  });

  // Sort: Names matching relative initials first
  const sortedNames = [...filteredNames].sort((a, b) => {
    const aMatch = relativeInitials.includes(a.english.charAt(0));
    const bMatch = relativeInitials.includes(b.english.charAt(0));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-serif text-primary">Discover Names</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 bg-white/50 border-primary/10 focus-visible:ring-secondary" 
            placeholder="Search by name, meaning..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
