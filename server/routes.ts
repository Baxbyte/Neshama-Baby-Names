import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedNameSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { Resend } from "resend";

const SITE_URL = "https://neshama-baby-names.replit.app";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // SEO: Serve sitemap.xml
  app.get("/sitemap.xml", (_req, res) => {
    const pages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/saved", priority: "0.8", changefreq: "daily" },
      { url: "/privacy", priority: "0.3", changefreq: "monthly" },
      { url: "/terms", priority: "0.3", changefreq: "monthly" },
      { url: "/cookies", priority: "0.3", changefreq: "monthly" },
      { url: "/ccpa", priority: "0.3", changefreq: "monthly" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  // SEO: Serve robots.txt
  app.get("/robots.txt", (_req, res) => {
    const robotsTxt = `# Neshama Baby Names - robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay suggestion (optional)
Crawl-delay: 1
`;
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Get all saved names
  app.get("/api/saved-names", async (_req, res) => {
    try {
      const names = await storage.getSavedNames();
      res.json(names);
    } catch (error) {
      console.error("Error fetching saved names:", error);
      res.status(500).json({ error: "Failed to fetch saved names" });
    }
  });

  // Get a single saved name by ID
  app.get("/api/saved-names/:id", async (req, res) => {
    try {
      const name = await storage.getSavedName(req.params.id);
      if (!name) {
        return res.status(404).json({ error: "Name not found" });
      }
      res.json(name);
    } catch (error) {
      console.error("Error fetching saved name:", error);
      res.status(500).json({ error: "Failed to fetch saved name" });
    }
  });

  // Create a new saved name
  app.post("/api/saved-names", async (req, res) => {
    try {
      console.log("POST /api/saved-names - Request body:", JSON.stringify(req.body));
      const result = insertSavedNameSchema.safeParse(req.body);
      if (!result.success) {
        console.error("Validation error:", result.error);
        return res.status(400).json({ 
          error: fromZodError(result.error).message 
        });
      }

      const name = await storage.createSavedName(result.data);
      res.status(201).json(name);
    } catch (error) {
      console.error("Error creating saved name:", error);
      res.status(500).json({ error: "Failed to create saved name", details: String(error) });
    }
  });

  // Delete a saved name
  app.delete("/api/saved-names/:id", async (req, res) => {
    try {
      await storage.deleteSavedName(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting saved name:", error);
      res.status(500).json({ error: "Failed to delete saved name" });
    }
  });

  // Send saved names via email
  app.post("/api/send-email", async (req, res) => {
    try {
      const { email, savedNames } = req.body;
      
      if (!email || !savedNames || !Array.isArray(savedNames)) {
        return res.status(400).json({ error: "Email and saved names are required" });
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const namesHtml = savedNames.map((name: { 
        firstName: string; 
        middleName: string; 
        lastName: string; 
        hebrewName: string; 
        hebrewNameHebrew: string;
        firstNameMeaning?: string;
        middleNameMeaning?: string;
        hebrewNameMeaning?: string;
        honoredRelatives?: string[];
      }) => {
        const meanings: string[] = [];
        if (name.firstNameMeaning) meanings.push(`${name.firstName}: "${name.firstNameMeaning}"`);
        if (name.middleNameMeaning && name.middleName) meanings.push(`${name.middleName}: "${name.middleNameMeaning}"`);
        if (name.hebrewNameMeaning && name.hebrewName) meanings.push(`${name.hebrewName}: "${name.hebrewNameMeaning}"`);
        
        return `
        <div style="background: linear-gradient(135deg, #f8f6f3 0%, #ffffff 100%); border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e8e4df;">
          <h3 style="margin: 0 0 8px 0; color: #1e3a5f; font-family: Georgia, serif; font-size: 24px;">
            ${name.firstName} ${name.middleName ? name.middleName + ' ' : ''}${name.lastName}
          </h3>
          ${name.hebrewNameHebrew ? `
            <p style="margin: 8px 0 4px 0; color: #2d4a6f; font-size: 20px; direction: rtl; text-align: right; font-family: Georgia, serif;">
              ${name.hebrewNameHebrew}
            </p>
          ` : ''}
          ${name.hebrewName ? `
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">
              Hebrew: ${name.hebrewName}
            </p>
          ` : ''}
          ${meanings.length > 0 ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e8e4df;">
              <p style="margin: 0 0 4px 0; color: #1e3a5f; font-size: 13px; font-weight: 600;">Name Meanings:</p>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                ${meanings.join('<br>')}
              </p>
            </div>
          ` : ''}
          ${name.honoredRelatives && name.honoredRelatives.length > 0 ? `
            <div style="margin-top: 12px; padding: 12px; background: #fef9e7; border-radius: 8px; border: 1px solid #d4a853;">
              <p style="margin: 0; color: #92670e; font-size: 13px;">
                <strong>Honoring:</strong> ${name.honoredRelatives.join(', ')}
              </p>
            </div>
          ` : ''}
        </div>
      `}).join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #faf8f5; margin: 0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e3a5f; font-family: Georgia, serif; font-size: 32px; margin: 0;">Neshama Baby Names</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #d4a853, #e6c47f); margin: 16px auto; border-radius: 2px;"></div>
              <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Your Saved Name Ideas</p>
            </div>
            
            <div style="margin-bottom: 32px;">
              ${namesHtml}
            </div>
            
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e8e4df;">
              <p style="color: #9ca3af; font-size: 12px; font-style: italic; margin: 0;">
                "Ledor Vador" — From Generation to Generation
              </p>
              
              <div style="margin: 24px 0;">
                <a href="https://neshama-baby-names.replit.app" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Visit Neshama Baby Names
                </a>
              </div>
              
              <div style="margin-top: 20px; padding: 16px; background: #fef9e7; border-radius: 8px; border: 1px solid #d4a853;">
                <p style="margin: 0; color: #92670e; font-size: 12px;">
                  <strong>Beta Notice:</strong> Neshama Baby Names is currently in beta — we're working harder than your bubbe before Pesach to make it perfect! Your feedback helps us improve.
                </p>
              </div>
              
              <p style="color: #9ca3af; font-size: 11px; margin: 20px 0 0 0;">
                &copy; 2025 Neshama Baby Names. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const { data, error } = await resend.emails.send({
        from: 'Neshama Baby Names <onboarding@resend.dev>',
        to: email,
        subject: 'Your Saved Baby Name Ideas',
        html: emailHtml,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ error: "Failed to send email", details: error.message });
      }

      res.json({ success: true, messageId: data?.id });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return httpServer;
}
