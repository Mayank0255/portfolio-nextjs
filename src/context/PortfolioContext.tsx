"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { PortfolioData, getStaticPortfolio } from "@/data/portfolio";

interface PortfolioContextType {
  data: PortfolioData;
  isEditMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  updateField: (path: string, value: unknown) => void;
  addItem: (path: string, item: unknown) => void;
  removeItem: (path: string, index: number) => void;
  resetToDefault: () => void;
  exportData: () => void;
  saveToDatabase: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_data";

const staticData = getStaticPortfolio();

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(staticData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isSaving, setIsSaving] = useState(false);
  const [typedKeys, setTypedKeys] = useState("");
  const hasFetchedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data from database
  const fetchFromDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const dbData = await res.json();
        setData(dbData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData));
      } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setData(JSON.parse(savedData));
        }
        // If no localStorage, keep static data as fallback
      }
    } catch (error) {
      console.error("Failed to fetch from database:", error);
      // Fallback to localStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
        } catch (e) {
          console.error("Failed to parse saved data:", e);
        }
      }
      // If no localStorage, keep static data as fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to database
  const saveToDatabase = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      console.log("Saved to database successfully");
    } catch (error) {
      console.error("Failed to save to database:", error);
      // Data is still in localStorage as backup
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  // Debounced auto-save to database
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, 2000); // Save after 2 seconds of inactivity
  }, [saveToDatabase]);

  // Fetch from database on initial mount (for both view and edit modes)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchFromDatabase();
    }
  }, [fetchFromDatabase]);

  // Persist to localStorage and trigger debounced database save when in edit mode
  useEffect(() => {
    if (isEditMode && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      debouncedSave();
    }
  }, [isEditMode, isLoading, data, debouncedSave]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
    };
  }, []);

  // Verify secret phrase via API
  const verifySecretPhrase = useCallback(async (phrase: string) => {
    if (phrase.length < 5) return; // Minimum length to avoid unnecessary API calls

    try {
      const res = await fetch("/api/auth/verify-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });

      if (res.ok) {
        const { valid } = await res.json();
        if (valid) {
          setIsEditMode((prev) => !prev);
          setTypedKeys("");
        }
      }
    } catch (error) {
      console.error("Failed to verify secret phrase:", error);
    }
  }, []);

  // Listen for secret phrase with debounced verification
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Only track printable characters
      if (e.key.length !== 1) return;

      const newTyped = (typedKeys + e.key).slice(-20); // Keep last 20 chars max
      setTypedKeys(newTyped);

      // Debounce: verify after 500ms of no typing
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
      verifyTimeoutRef.current = setTimeout(() => {
        verifySecretPhrase(newTyped);
        setTypedKeys(""); // Clear buffer after verification attempt
      }, 500);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedKeys, verifySecretPhrase]);

  // Update a field by path (e.g., "profile.name" or "experience.0.company")
  const updateField = useCallback((path: string, value: unknown) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current: Record<string, unknown> = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined) {
          current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
        }
        current = current[key] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  // Add an item to an array field
  const addItem = useCallback((path: string, item: unknown) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current: Record<string, unknown> = newData;

      for (const key of keys) {
        current = current[key] as Record<string, unknown>;
      }

      if (Array.isArray(current)) {
        (current as unknown[]).push(item);
      }

      return newData;
    });
  }, []);

  // Remove an item from an array field
  const removeItem = useCallback((path: string, index: number) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current: Record<string, unknown> = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }

      const arr = current[keys[keys.length - 1]] as unknown[];
      if (Array.isArray(arr)) {
        arr.splice(index, 1);
      }

      return newData;
    });
  }, []);

  const resetToDefault = useCallback(async () => {
    if (confirm("This will reset all data to defaults. Are you sure?")) {
      setData(staticData);
      localStorage.removeItem(STORAGE_KEY);
      // Also reset database
      try {
        await fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staticData),
        });
      } catch (error) {
        console.error("Failed to reset database:", error);
      }
    }
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isEditMode,
        isLoading,
        isSaving,
        updateField,
        addItem,
        removeItem,
        resetToDefault,
        exportData,
        saveToDatabase,
      }}
    >
      {children}
      {isEditMode && <EditModeIndicator />}
    </PortfolioContext.Provider>
  );
}

function EditModeIndicator() {
  const context = useContext(PortfolioContext);
  if (!context) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span className="font-medium">Edit Mode</span>

      {context.isLoading && (
        <span className="ml-2 text-sm opacity-80">Loading...</span>
      )}
      {context.isSaving && (
        <span className="ml-2 text-sm opacity-80 flex items-center gap-1">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
      )}

      <button
        onClick={() => context.saveToDatabase()}
        disabled={context.isSaving}
        className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
      >
        Save Now
      </button>
      <button
        onClick={context.exportData}
        className="bg-white text-green-600 px-2 py-1 rounded text-sm font-medium hover:bg-green-100"
      >
        Export
      </button>
      <button
        onClick={context.resetToDefault}
        className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
