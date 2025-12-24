import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSavedNameSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}
