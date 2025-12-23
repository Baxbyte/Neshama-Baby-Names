import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Relative {
  id: string;
  name: string;
  relation: string;
}

interface RelativeInputProps {
  relatives: Relative[];
  setRelatives: (relatives: Relative[]) => void;
}

export function RelativeInput({ relatives, setRelatives }: RelativeInputProps) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  const addRelative = () => {
    if (!name) return;
    const newRelative: Relative = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      relation: relation || 'Relative',
    };
    setRelatives([...relatives, newRelative]);
    setName('');
    setRelation('');
  };

  const removeRelative = (id: string) => {
    setRelatives(relatives.filter((r) => r.id !== id));
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary">Honor Past Relatives</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="relative-name">Relative's Name</Label>
            <Input
              id="relative-name"
              placeholder="e.g. Bubbe Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relation">Relationship (Optional)</Label>
            <Input
              id="relation"
              placeholder="e.g. Great Grandmother"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="bg-white/80"
            />
          </div>
          <Button onClick={addRelative} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {relatives.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Add relatives to see name suggestions based on their initials.</p>
          )}
          {relatives.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 animate-in fade-in zoom-in"
            >
              <span className="font-medium">{rel.name}</span>
              <span className="text-xs opacity-70">({rel.relation})</span>
              <button
                onClick={() => removeRelative(rel.id)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
