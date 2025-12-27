import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-primary/10 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p>&copy; 2025 Neshama Baby Names. All rights reserved.</p>
            <p className="mt-1">
              Designed by:{" "}
              <a
                href="https://www.linkedin.com/in/brett-axler-11577142/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors underline underline-offset-2"
                data-testid="link-designer"
              >
                Brett Axler
              </a>
            </p>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Legal">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </Link>
            <span className="hidden md:inline text-primary/30">|</span>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
            <span className="hidden md:inline text-primary/30">|</span>
            <Link
              href="/cookies"
              className="hover:text-primary transition-colors"
              data-testid="link-cookies"
            >
              Cookie Policy
            </Link>
            <span className="hidden md:inline text-primary/30">|</span>
            <Link
              href="/ccpa"
              className="hover:text-primary transition-colors"
              data-testid="link-ccpa"
            >
              Do Not Sell My Info
            </Link>
          </nav>
        </div>
        
        <div className="mt-6 pt-4 border-t border-primary/5 text-center">
          <p className="text-xs text-muted-foreground/70 italic" data-testid="text-beta-notice">
            We're working harder than your bubbe before Pesach! This site is in beta — some features are still cooking. Thanks for bearing with us!
          </p>
        </div>
      </div>
    </footer>
  );
}
