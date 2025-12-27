import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

interface LocalSavedName {
  id: string;
  firstName: string;
  middleName: string;
  hebrewName: string;
  lastName: string;
  firstNameHebrew: string;
  hebrewNameHebrew: string;
  savedAt: string;
  firstNameMeaning?: string;
  middleNameMeaning?: string;
  hebrewNameMeaning?: string;
  honoredRelatives?: string[];
}

const SAVED_NAMES_KEY = "neshama-saved-names";

export default function SavedNames() {
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [savedNames, setSavedNames] = useState<LocalSavedName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SAVED_NAMES_KEY);
    if (stored) {
      setSavedNames(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const removeSavedName = (id: string) => {
    const updated = savedNames.filter(name => name.id !== id);
    setSavedNames(updated);
    localStorage.setItem(SAVED_NAMES_KEY, JSON.stringify(updated));
    toast.success("Name idea removed");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (savedNames.length === 0) {
      toast.error("No saved names to send");
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, savedNames }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to send email');
      }

      toast.success("Email sent successfully!");
      setEmailSent(true);
      setShowEmailForm(false);
      setEmail("");
      
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Email error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 pt-8 bg-gradient-to-b from-orange-50 via-blue-50 to-white">
      {/* Main Header - matching home page */}
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <Link href="/">
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-3 cursor-pointer hover:opacity-80 transition-opacity">Neshama Baby Names</h1>
        </Link>
        <div className="h-1 w-24 bg-secondary mx-auto mt-6 rounded-full" />
      </header>

      <div className="max-w-4xl mx-auto">
        
        {/* Page title with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-primary">Your Saved Names</h2>
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
                      {(nameIdea.hebrewName || nameIdea.hebrewNameHebrew) && (
                        <div className="border-t border-primary/10 pt-3">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Hebrew Name</p>
                          {nameIdea.hebrewNameHebrew && (
                            <p className="text-2xl font-serif text-secondary-foreground" style={{ direction: 'rtl' }}>
                              {nameIdea.hebrewNameHebrew}
                            </p>
                          )}
                          {nameIdea.hebrewName && (
                            <p className="text-sm text-muted-foreground mt-1">{nameIdea.hebrewName}</p>
                          )}
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
                    data-testid="button-show-email-form"
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
                        disabled={isSending}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="submit"
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                        data-testid="button-send-email"
                        disabled={isSending}
                      >
                        {isSending ? "Sending..." : "Send Email"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowEmailForm(false)}
                        className="flex-1"
                        disabled={isSending}
                        data-testid="button-cancel-email"
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
      
      <Footer />
    </div>
  );
}
