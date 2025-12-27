import React from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import brisketImage from "@assets/generated_images/cartoon_brisket_in_roasting_pan.png";

const pageNames: Record<string, string> = {
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/cookies": "Cookie Policy",
  "/ccpa": "Do Not Sell My Info",
};

export default function ComingSoon() {
  const [, params] = useRoute("/:page");
  const currentPath = `/${params?.page || ""}`;
  const pageName = pageNames[currentPath] || "This Page";

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 pt-8 bg-gradient-to-b from-orange-50 via-blue-50 to-white">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <Link href="/" data-testid="link-home-heading">
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-3 cursor-pointer hover:opacity-80 transition-opacity">
            Neshama Baby Names
          </h1>
        </Link>
        <div className="h-1 w-24 bg-secondary mx-auto mt-6 rounded-full" />
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" data-testid="link-back">
            <Button variant="outline" size="icon" className="rounded-full" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-primary" data-testid="text-page-title">{pageName}</h2>
            <p className="text-muted-foreground mt-1">Coming Soon</p>
          </div>
        </div>

        <Card className="bg-white/60 backdrop-blur-md border-white/50 overflow-hidden">
          <CardContent className="pt-8 pb-8 text-center">
            <img 
              src={brisketImage} 
              alt="A delicious brisket cooking" 
              className="w-full max-w-md mx-auto rounded-xl shadow-lg mb-8"
              data-testid="img-brisket"
            />
            
            <h3 className="text-2xl font-serif text-primary mb-4" data-testid="text-coming-soon-heading">
              Like a Good Brisket, Good Things Take Time!
            </h3>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto" data-testid="text-coming-soon-message">
              Our <span className="font-semibold">{pageName}</span> is still in the oven. 
              We're working harder than your bubbe before Pesach to get it ready!
            </p>
            
            <p className="text-sm text-muted-foreground/70 italic mb-8">
              Thank you for your patience. Check back soon — it'll be worth the wait!
            </p>
            
            <Link href="/" data-testid="link-back-to-builder">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-8" data-testid="button-back-to-builder">
                Back to Name Builder
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
