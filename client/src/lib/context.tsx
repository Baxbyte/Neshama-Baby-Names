import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NameData } from './data';

interface Relative {
  id: string;
  name: string;
  relation: string;
}

interface AppState {
  relatives: Relative[];
  firstName: NameData | null;
  middleName: NameData | null;
  hebrewName: NameData | null;
  lastName: string;
}

interface AppContextType extends AppState {
  setRelatives: (relatives: Relative[]) => void;
  setFirstName: (name: NameData | null) => void;
  setMiddleName: (name: NameData | null) => void;
  setHebrewName: (name: NameData | null) => void;
  setLastName: (lastName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'neshama-app-state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [relatives, setRelativesState] = useState<Relative[]>([]);
  const [firstName, setFirstNameState] = useState<NameData | null>(null);
  const [middleName, setMiddleNameState] = useState<NameData | null>(null);
  const [hebrewName, setHebrewNameState] = useState<NameData | null>(null);
  const [lastName, setLastNameState] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: AppState = JSON.parse(saved);
        setRelativesState(state.relatives || []);
        setFirstNameState(state.firstName || null);
        setMiddleNameState(state.middleName || null);
        setHebrewNameState(state.hebrewName || null);
        setLastNameState(state.lastName || '');
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    const state: AppState = {
      relatives,
      firstName,
      middleName,
      hebrewName,
      lastName,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [relatives, firstName, middleName, hebrewName, lastName, isInitialized]);

  const setRelatives = (newRelatives: Relative[]) => {
    setRelativesState(newRelatives);
  };

  const setFirstName = (name: NameData | null) => {
    setFirstNameState(name);
  };

  const setMiddleName = (name: NameData | null) => {
    setMiddleNameState(name);
  };

  const setHebrewName = (name: NameData | null) => {
    setHebrewNameState(name);
  };

  const setLastName = (name: string) => {
    setLastNameState(name);
  };

  return (
    <AppContext.Provider
      value={{
        relatives,
        firstName,
        middleName,
        hebrewName,
        lastName,
        setRelatives,
        setFirstName,
        setMiddleName,
        setHebrewName,
        setLastName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
