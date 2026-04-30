// ============================================================
// Hook de configuração com persistência via localStorage
// Fonte única de verdade para o mapa e o painel admin
// ============================================================

import { useState, useCallback } from 'react';
import { motoboyConfig } from '../config/motoboy';
import type { MotoboyConfig } from '../types';

const STORAGE_KEY = 'dve_config';
const PIN_KEY = 'dve_admin_pin';
const DEFAULT_PIN = '1234';

function loadConfig(): MotoboyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MotoboyConfig;
  } catch {
    // fallback to default
  }
  return motoboyConfig;
}

function saveConfig(config: MotoboyConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getAdminPin(): string {
  return localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
}

export function setAdminPin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
}

export function useConfig() {
  const [config, setConfigState] = useState<MotoboyConfig>(loadConfig);

  const updateConfig = useCallback((updater: (prev: MotoboyConfig) => MotoboyConfig) => {
    setConfigState((prev) => {
      const next = updater(prev);
      saveConfig(next);
      return next;
    });
  }, []);

  const setConfig = useCallback((next: MotoboyConfig) => {
    saveConfig(next);
    setConfigState(next);
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfigState(motoboyConfig);
  }, []);

  return { config, updateConfig, setConfig, resetToDefaults };
}
