import type { SavedName, InsertSavedName } from "@shared/schema";

export async function getSavedNames(): Promise<SavedName[]> {
  const response = await fetch("/api/saved-names");
  if (!response.ok) {
    throw new Error("Failed to fetch saved names");
  }
  return response.json();
}

export async function createSavedName(name: InsertSavedName): Promise<SavedName> {
  try {
    const response = await fetch("/api/saved-names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Save failed:", response.status, errorText);
      throw new Error(`Failed to save name: ${response.status}`);
    }
    const data = await response.json();
    console.log("Save successful:", data);
    return data;
  } catch (error) {
    console.error("Save error:", error);
    throw error;
  }
}

export async function deleteSavedName(id: string): Promise<void> {
  const response = await fetch(`/api/saved-names/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete name");
  }
}
