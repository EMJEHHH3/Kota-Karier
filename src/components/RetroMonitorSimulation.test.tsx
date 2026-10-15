// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import RetroMonitorSimulation from './RetroMonitorSimulation';
import { softwareEngineerTerminalSim } from '../data/terminalSimulations/softwareEngineer';
import { UserProvider } from '../lib/context';

afterEach(() => {
  cleanup();
});

function renderSimulation() {
  const onExit = vi.fn();
  const onFinish = vi.fn();
  return {
    ...render(
      <UserProvider>
        <RetroMonitorSimulation
          simulation={softwareEngineerTerminalSim}
          preInterest={4}
          onFinish={onFinish}
          onExit={onExit}
        />
      </UserProvider>
    ),
    onExit,
    onFinish,
  };
}

describe('RetroMonitorSimulation', () => {
  it('does NOT render any coffee mug or coffee text', () => {
    const { container } = renderSimulation();

    // No .retro-coffee-mug element
    expect(container.querySelector('.retro-coffee-mug')).toBeNull();
    // No "Kopi Kantor" or coffee emoji
    expect(screen.queryByText(/kopi kantor/i)).toBeNull();
  });

  it('renders the Clipboard on the LEFT side of the monitor with only TASKS (no events)', () => {
    const { container } = renderSimulation();

    const workstation = container.querySelector('.retro-workstation-layout');
    expect(workstation).not.toBeNull();

    // Clipboard is child 0 (LEFT), monitor-column is child 1 (RIGHT)
    const firstChild = workstation!.children[0];
    const secondChild = workstation!.children[1];
    expect(firstChild.classList.contains('retro-clipboard-taskboard')).toBe(true);
    expect(secondChild.classList.contains('monitor-station')).toBe(true);
    expect(secondChild.classList.contains('retro-monitor-column')).toBe(true);

    // Authentic clipboard elements
    expect(container.querySelector('.clipboard-board')).not.toBeNull();
    expect(container.querySelector('.clipboard-metal-clip')).not.toBeNull();
    expect(container.querySelector('.clipboard-paper')).not.toBeNull();

    // Road sign elements MUST BE GONE
    expect(container.querySelector('.sign-pole')).toBeNull();
    expect(container.querySelector('.sign-base')).toBeNull();
    expect(container.querySelector('.sign-board')).toBeNull();

    // Check title and hours
    expect(screen.getByText('TUGAS HARI INI')).toBeDefined();
    expect(screen.getByText('08.00 - 16.00 WIB')).toBeDefined();

    // Check ONLY task items (no events)
    const taskItems = container.querySelectorAll('.clipboard-task-item');
    expect(taskItems.length).toBe(4); // Only 4 tasks, no events

    expect(screen.getByText('Halo Dunia')).toBeDefined();
    expect(screen.getByText('Variabel')).toBeDefined();
    expect(screen.getByText('Perbaiki Bug')).toBeDefined();
    expect(screen.getByText('Simpan Kode')).toBeDefined();

    // NO event items in clipboard — no "!" exclamation, no event class
    expect(container.querySelector('.clipboard-task-item--event')).toBeNull();
    expect(container.querySelector('.clipboard-event-exclamation')).toBeNull();
  });

  it('monitor station contains bezel, stand, base, and keyboard in centered flex layout', () => {
    const { container } = renderSimulation();

    const monitorStation = container.querySelector('.monitor-station');
    expect(monitorStation).not.toBeNull();

    // Monitor-outer, stand, base, and keyboard are all inside the monitor-station
    expect(monitorStation!.querySelector('.retro-monitor-outer')).not.toBeNull();
    expect(monitorStation!.querySelector('.retro-monitor-stand')).not.toBeNull();
    expect(monitorStation!.querySelector('.retro-monitor-base')).not.toBeNull();
    expect(monitorStation!.querySelector('.retro-keyboard')).not.toBeNull();
  });

  it('renders reduced text in terminal: no long opening banner, compact guidance with code box', () => {
    const { container } = renderSimulation();

    // No long banner text
    expect(screen.queryByText(/ALL RIGHTS RESERVED/i)).toBeNull();
    expect(screen.queryByText(/Ketik di terminal bawah/i)).toBeNull();
    expect(screen.queryByText(/Tekan Enter untuk menjalankan/i)).toBeNull();

    // Has short guidance and code box
    const codeEl = container.querySelector('code');
    expect(codeEl).not.toBeNull();
    expect(codeEl?.textContent).toBe('print("Halo Dunia")');

    // Input placeholder is "ketik di sini..."
    const input = screen.getByPlaceholderText('ketik di sini...');
    expect(input).toBeDefined();
  });

  it('executes task 1, updates clipboard item to completed (✓), and shows clean output', () => {
    vi.useFakeTimers();
    const { container } = renderSimulation();

    // Initially task 1 has aria-current="step" and icon "▶"
    let taskItems = container.querySelectorAll('.clipboard-task-item');
    expect(taskItems[0].getAttribute('aria-current')).toBe('step');
    expect(taskItems[0].querySelector('.clipboard-status-icon')?.textContent).toBe('▶');
    expect(taskItems[1].querySelector('.clipboard-status-icon')?.textContent).toBe('☐');

    const input = screen.getByPlaceholderText('ketik di sini...');
    fireEvent.change(input, { target: { value: 'print("Halo Dunia")' } });
    fireEvent.submit(input.closest('form')!);

    // Terminal output has "Halo Dunia" and "✓ Berhasil"
    expect(screen.getByText(/Halo Dunia\s*✓ Berhasil/)).toBeDefined();

    // No duplicate [OK] or [BERHASIL]
    expect(screen.queryByText(/\[BERHASIL\] Langkah selesai/i)).toBeNull();

    // Advance timer by 650ms to advance to stepIndex 1
    act(() => {
      vi.advanceTimersByTime(650);
    });

    taskItems = container.querySelectorAll('.clipboard-task-item');
    // Task 1 marked completed with "✓"
    expect(taskItems[0].classList.contains('clipboard-task-item--completed')).toBe(true);
    expect(taskItems[0].querySelector('.clipboard-status-icon')?.textContent).toBe('✓');

    vi.useRealTimers();
  });
});
