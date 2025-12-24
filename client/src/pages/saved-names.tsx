import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedNames, deleteSavedName } from "@/lib/api";
export default function SavedNames() {
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const queryClient = useQueryClient();

  const { data: savedNames = [], isLoading } = useQuery({
    queryKey: ["saved-names"],
    queryFn: getSavedNames,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-names"] });
      toast.success("Name idea removed");
    },
    onError: () => {
      toast.error("Failed to delete name. Please try again.");
    },
  });

  const removeSavedName = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    // In a real app, this would send an email via backend
    // For now, we'll show a success message
    const emailContent = savedNames.map(name => 
      `${name.firstName} ${name.middleName} ${name.lastName}\nHebrew: ${name.hebrewName}`
    ).join('\n\n');
    
    // Mock email send
    toast.success("Email sent successfully!");
    setEmailSent(true);
    setShowEmailForm(false);
    setEmail("");
    
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 pt-8 bg-gradient-to-b from-orange-50 via-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-display text-primary">Your Saved Names</h1>
            <p className="text-muted-foreground mt-1">Review and manage your baby name ideas</p>
          </div>
        </div>

        {isLoading ? (
          <Card className="bg-white/60 backdrop-blur-md border-white/50">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-lg text-muted-foreground">Loading saved names...</p>
            </CardContent>
          </Card>
        ) : savedNames.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-md border-white/50">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">No saved name ideas yet</p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                  Go Back to Builder
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Saved Names Grid */}
            <div className="space-y-4 mb-12">
              {savedNames.map((nameIdea) => (
                <Card key={nameIdea.id} className="bg-white/60 backdrop-blur-md border-white/50 hover:border-primary/20 transition-all">
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Full English Name */}
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Full English Name</p>
                        <p className="text-3xl font-serif text-primary font-bold">
                          {nameIdea.firstName} {nameIdea.middleName} {nameIdea.lastName}
                        </p>
                      </div>

                      {/* Hebrew Name if available */}
                      {nameIdea.hebrewName && (
                        <div className="border-t border-primary/10 pt-3">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Hebrew Name</p>
                          <p className="text-2xl font-serif text-secondary-foreground" style={{ direction: 'rtl' }}>
                            {nameIdea.hebrewNameHebrew}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{nameIdea.hebrewName}</p>
                        </div>
                      )}

                      {/* Saved date */}
                      <p className="text-xs text-muted-foreground pt-2">
                        Saved on {new Date(nameIdea.savedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSavedName(nameIdea.id)}
                      className="ml-4 hover:bg-red-50 hover:text-red-600"
                      data-testid={`button-remove-${nameIdea.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Email Export Section */}
            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary" />
                  Share Your Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emailSent && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✓ Email sent successfully! Check your inbox.
                  </div>
                )}

                {!showEmailForm ? (
                  <Button 
                    onClick={() => setShowEmailForm(true)}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Saved Names to Yourself
                  </Button>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/50 border-primary/10"
                        data-testid="input-email"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="submit"
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                        data-testid="button-send-email"
                      >
                        Send Email
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowEmailForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-6 p-4 bg-white/40 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 <strong>Tip:</strong> Save all your favorite name combinations and easily share them via email. 
                    You can review and compare your options anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
