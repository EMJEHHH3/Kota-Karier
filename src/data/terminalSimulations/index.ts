import type { TerminalSimulation } from '../../types/terminalSimulation';
import { softwareEngineerTerminalSim } from './softwareEngineer';
import { dataAnalystTerminalSim } from './dataAnalyst';

export const TERMINAL_SIMULATIONS: Record<string, TerminalSimulation> = {
  'software-engineer': softwareEngineerTerminalSim,
  'data-analyst': dataAnalystTerminalSim,
};

export function getTerminalSimulation(professionId: string): TerminalSimulation | undefined {
  return TERMINAL_SIMULATIONS[professionId];
}

export function isTerminalProfession(professionId: string): boolean {
  return professionId in TERMINAL_SIMULATIONS;
}
