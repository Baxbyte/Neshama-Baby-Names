import React from "react";

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
            <a
              href="/privacy"
              className="hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
            <span className="hidden md:inline text-primary/30">|</span>
            <a
              href="/terms"
              className="hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </a>
            <span className="hidden md:inline text-primary/30">|</span>
            <a
              href="/cookies"
              className="hover:text-primary transition-colors"
              data-testid="link-cookies"
            >
              Cookie Policy
            </a>
            <span className="hidden md:inline text-primary/30">|</span>
            <a
              href="/ccpa"
              className="hover:text-primary transition-colors"
              data-testid="link-ccpa"
            >
              Do Not Sell My Info
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
