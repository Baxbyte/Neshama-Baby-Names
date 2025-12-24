import type { SavedName, InsertSavedName } from "@shared/schema";

export async function getSavedNames(): Promise<SavedName[]> {
  const response = await fetch("/api/saved-names");
  if (!response.ok) {
    throw new Error("Failed to fetch saved names");
  }
  return response.json();
}

export async function createSavedName(name: InsertSavedName): Promise<SavedName> {
  const response = await fetch("/api/saved-names", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(name),
  });
  if (!response.ok) {
    throw new Error("Failed to save name");
  }
  return response.json();
}

export async function deleteSavedName(id: string): Promise<void> {
  const response = await fetch(`/api/saved-names/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete name");
  }
}
