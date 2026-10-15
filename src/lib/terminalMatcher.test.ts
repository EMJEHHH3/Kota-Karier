import { describe, it, expect } from 'vitest';
import { normalizeCommand, testCommandPattern } from './terminalMatcher';
import { softwareEngineerTerminalSim } from '../data/terminalSimulations/softwareEngineer';
import { dataAnalystTerminalSim } from '../data/terminalSimulations/dataAnalyst';
import type { TerminalTask } from '../types/terminalSimulation';

describe('terminalMatcher', () => {
  describe('normalizeCommand', () => {
    it('trims whitespace and converts to lowercase', () => {
      expect(normalizeCommand('  PRINT("Halo Dunia")  ')).toBe('print("halo dunia")');
    });

    it('normalizes single quotes and smart quotes to standard double quotes', () => {
      expect(normalizeCommand("print('Halo Dunia')")).toBe('print("halo dunia")');
      expect(normalizeCommand('print(“Halo Dunia”)')).toBe('print("halo dunia")');
      expect(normalizeCommand("print(‘Halo Dunia’)")).toBe('print("halo dunia")');
    });

    it('collapses multiple whitespace characters into a single space', () => {
      expect(normalizeCommand('select   *    from   penjualan')).toBe('select * from penjualan');
    });
  });

  describe('Software Engineer tasks pattern matching', () => {
    const task1 = softwareEngineerTerminalSim.urutan[0].data as TerminalTask;
    const task2 = softwareEngineerTerminalSim.urutan[1].data as TerminalTask;
    const task3 = softwareEngineerTerminalSim.urutan[3].data as TerminalTask;
    const task4 = softwareEngineerTerminalSim.urutan[5].data as TerminalTask;

    it('validates Task 1: print("Halo Dunia")', () => {
      expect(testCommandPattern('print("Halo Dunia")', task1.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern("print('Halo Dunia')", task1.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('print( "Halo Dunia" );', task1.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('print("halo dunia")', task1.polaJawabanBenar)).toBe(true);
      // Incorrect cases
      expect(testCommandPattern('console.log("Halo Dunia")', task1.polaJawabanBenar)).toBe(false);
      expect(testCommandPattern('print("Halo")', task1.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 2: nama = "Budi"; print(nama)', () => {
      expect(testCommandPattern('nama = "Budi"; print(nama)', task2.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern("nama='Budi';print(nama)", task2.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('nama = "Budi"', task2.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('x = 10', task2.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 3: print("Total: " + str(5))', () => {
      expect(testCommandPattern('print("Total: " + str(5))', task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern("print('Total: ' + str(5));", task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('print(f"Total: 5")', task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('print("Total: 5")', task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('print("Total: " + 5)', task3.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 4: git commit -m "fix bug total"', () => {
      expect(testCommandPattern('git commit -m "fix bug total"', task4.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern("git commit -m 'fix bug total'", task4.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('git commit -m "fix bug"', task4.polaJawabanBenar)).toBe(false);
    });
  });

  describe('Data Analyst tasks pattern matching', () => {
    const task1 = dataAnalystTerminalSim.urutan[0].data as TerminalTask;
    const task2 = dataAnalystTerminalSim.urutan[1].data as TerminalTask;
    const task3 = dataAnalystTerminalSim.urutan[3].data as TerminalTask;
    const task4 = dataAnalystTerminalSim.urutan[5].data as TerminalTask;

    it('validates Task 1: SELECT * FROM penjualan;', () => {
      expect(testCommandPattern('SELECT * FROM penjualan;', task1.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('select * from penjualan', task1.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('SELECT nama FROM penjualan', task1.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 2: SELECT * FROM penjualan WHERE kota = "Jakarta";', () => {
      expect(testCommandPattern("SELECT * FROM penjualan WHERE kota = 'Jakarta';", task2.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('select * from penjualan where kota="jakarta"', task2.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('SELECT * FROM penjualan WHERE kota = "Bandung"', task2.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 3: SELECT SUM(total_rp) FROM penjualan;', () => {
      expect(testCommandPattern('SELECT SUM(total_rp) FROM penjualan;', task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('select sum(total_rp) from penjualan', task3.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('SELECT COUNT(*) FROM penjualan', task3.polaJawabanBenar)).toBe(false);
    });

    it('validates Task 4: SELECT * FROM penjualan ORDER BY total_rp DESC;', () => {
      expect(testCommandPattern('SELECT * FROM penjualan ORDER BY total_rp DESC;', task4.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('select * from penjualan order by total_rp desc', task4.polaJawabanBenar)).toBe(true);
      expect(testCommandPattern('SELECT * FROM penjualan ORDER BY total_rp ASC', task4.polaJawabanBenar)).toBe(false);
    });
  });
});
