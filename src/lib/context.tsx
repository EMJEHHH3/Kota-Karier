/**
 * Global User State Context
 * Connects React UI to localStorage with reactive updates and accessibility classes.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { UserState, UserSettings, TestResult, SimulationResult } from '../types';
import { loadState, saveState, clearState, storage, type SyncStatus } from './storage';
import { DEFAULT_USER_STATE } from '../types/result';
import { useAuth } from './AuthContext';

export interface UserContextValue {
  state: UserState;
  syncStatus: SyncStatus;
  saveTestResult: (result: TestResult) => void;
  saveSimulationResult: (result: SimulationResult) => void;
  toggleCandidate: (professionId: string) => void;
  isCandidate: (professionId: string) => boolean;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetState: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<UserState>(() => loadState());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => storage.getSyncStatus());

  // Listen to sync status from storage layer
  useEffect(() => {
    return storage.onSyncStatusChange((newStatus) => {
      setSyncStatus(newStatus);
    });
  }, []);

  // Sync user state on login, logout, and account switch
  useEffect(() => {
    storage.handleUserChange(user ? user.id : null, (updatedState) => {
      setState(updatedState);
    });
  }, [user]);

  // Save to storage layer whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Synchronize accessibility classes on <body> or documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.disableScanlines) {
      root.classList.add('no-scanlines');
    } else {
      root.classList.remove('no-scanlines');
    }

    if (state.settings.disableAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  }, [state.settings]);

  const value = useMemo<UserContextValue>(() => ({
    state,
    syncStatus,
    saveTestResult: (result: TestResult) => {
      setState((prev) => ({
        ...prev,
        testResult: result,
      }));
    },
    saveSimulationResult: (result: SimulationResult) => {
      setState((prev) => ({
        ...prev,
        simulationResults: {
          ...prev.simulationResults,
          [result.professionId]: result,
        },
      }));
    },
    toggleCandidate: (professionId: string) => {
      setState((prev) => {
        const exists = prev.candidates.some((c) => c.professionId === professionId);
        const candidates = exists
          ? prev.candidates.filter((c) => c.professionId !== professionId)
          : [...prev.candidates, { professionId, savedAt: Date.now() }];
        return {
          ...prev,
          candidates,
        };
      });
    },
    isCandidate: (professionId: string) => {
      return state.candidates.some((c) => c.professionId === professionId);
    },
    updateSettings: (newSettings: Partial<UserSettings>) => {
      setState((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings,
        },
      }));
    },
    resetState: () => {
      clearState();
      setState({ ...DEFAULT_USER_STATE });
    },
  }), [state, syncStatus]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserState(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return ctx;
}
