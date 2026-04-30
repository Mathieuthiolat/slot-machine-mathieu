import { describe, it, expect } from 'vitest';
import { WinCalculator } from '../classes/WinCalculator.js';

import { bands } from '../config/bands.js';
import { paylines } from '../config/paylines.js';
import { paytable } from '../config/paytable.js';



function buildGrid(positions) {
  return bands.map((band, i) => {
    const col = [];
    for (let row = 0; row < 3; row++) {
      col.push(band[(positions[i] + row) % band.length]);
    }
    return col;
  });
}

const calculator = new WinCalculator({ paylines, paytable });

// ─── Grid shape ─────────────────────────────────────────────────────────────

describe('buildGrid', () => {
  it('returns 5 reels of 3 rows each', () => {
    const grid = buildGrid([0, 0, 0, 0, 0]);
    expect(grid).toHaveLength(5);
    grid.forEach(col => expect(col).toHaveLength(3));
  });

  it('wraps around the band correctly at the last position', () => {
    const grid = buildGrid([19, 0, 0, 0, 0]);
    expect(grid[0][0]).toBe('hv2');
    expect(grid[0][1]).toBe('hv2'); 
    expect(grid[0][2]).toBe('lv3'); 
  });

  it('matches the spec initial screen at positions [0,0,0,0,0]', () => {
    const grid = buildGrid([0, 0, 0, 0, 0]);
    // row 0: hv2 hv1 lv1 hv2 lv3
    expect(grid.map(col => col[0])).toEqual(['hv2','hv1','lv1','hv2','lv3']);
    // row 1: lv3 lv2 hv2 lv2 lv4
    expect(grid.map(col => col[1])).toEqual(['lv3','lv2','hv2','lv2','lv4']);
    // row 2: lv3 lv3 lv3 hv3 hv2
    expect(grid.map(col => col[2])).toEqual(['lv3','lv3','lv3','hv3','hv2']);
  });

  it('matches the spec screen at positions [18,9,2,0,12]', () => {
    const grid = buildGrid([18, 9, 2, 0, 12]);
    expect(grid.map(col => col[0])).toEqual(['lv3','hv4','lv3','hv2','lv2']);
    expect(grid.map(col => col[1])).toEqual(['hv2','lv3','lv4','lv2','hv4']);
    expect(grid.map(col => col[2])).toEqual(['hv2','hv2','hv3','hv3','hv1']);
  });
});

// ─── WinCalculator  ──────────────────────────────────────────

describe('WinCalculator.calculate', () => {

  it('positions [0,11,1,10,14] → total 6, payline 2 hv2×3=5, payline 5 lv3×3=1', () => {
    const result = calculator.calculate(buildGrid([0, 11, 1, 10, 14]));

    expect(result.total).toBe(6);
    expect(result.wins).toHaveLength(2);

    expect(result.wins[0]).toMatchObject({ paylineId: 2, symbol: 'hv2', count: 3, payout: 5 });
    expect(result.wins[1]).toMatchObject({ paylineId: 5, symbol: 'lv3', count: 3, payout: 1 });
  });

  it('positions [0,0,0,0,0] → total 1, payline 3 lv3×3=1', () => {
    const result = calculator.calculate(buildGrid([0, 0, 0, 0, 0]));

    expect(result.total).toBe(1);
    expect(result.wins).toHaveLength(1);
    expect(result.wins[0]).toMatchObject({ paylineId: 3, symbol: 'lv3', count: 3, payout: 1 });
  });
  
  it('positions [5,14,9,9,16] → total 10, payline 6 lv1×4=5, payline 7 lv1×3=4=5', () => {
    const result = calculator.calculate(buildGrid([5, 14, 9, 9, 16]));
 
    expect(result.total).toBe(10);
    expect(result.wins).toHaveLength(2);
    expect(result.wins[0]).toMatchObject({ paylineId: 6, symbol: 'lv1', count: 4, payout: 5 });
    expect(result.wins[1]).toMatchObject({ paylineId: 7, symbol: 'lv1', count: 4, payout: 5 });
  });


  it('positions [1,16,2,15,0] → total 0, no wins', () => {
    const result = calculator.calculate(buildGrid([1, 16, 2, 15, 0]));

    expect(result.total).toBe(0);
    expect(result.wins).toHaveLength(0);
  });

  it('positions [18,9,2,0,12] → total 0, no wins', () => {
    const result = calculator.calculate(buildGrid([18, 9, 2, 0, 12]));

    expect(result.total).toBe(0);
    expect(result.wins).toHaveLength(0);
  });
});

// ─── WinCalculator — paytable edge cases ────────────────────────────────────

describe('WinCalculator.getPayout', () => {

  it('returns 0 for fewer than 3 matching symbols', () => {
    expect(calculator.getPayout('hv1', 1)).toBe(0);
    expect(calculator.getPayout('hv1', 2)).toBe(0);
  });

  it('pays correctly for 3, 4, 5 of a kind for each symbol', () => {
    const cases = [
      ['hv1', 3, 10], ['hv1', 4, 20], ['hv1', 5, 50],
      ['hv2', 3,  5], ['hv2', 4, 10], ['hv2', 5, 20],
      ['hv3', 3,  5], ['hv3', 4, 10], ['hv3', 5, 15],
      ['hv4', 3,  5], ['hv4', 4, 10], ['hv4', 5, 15],
      ['lv1', 3,  2], ['lv1', 4,  5], ['lv1', 5, 10],
      ['lv2', 3,  1], ['lv2', 4,  2], ['lv2', 5,  5],
      ['lv3', 3,  1], ['lv3', 4,  2], ['lv3', 5,  3],
      ['lv4', 3,  1], ['lv4', 4,  2], ['lv4', 5,  3],
    ];

    for (const [symbol, count, expected] of cases) {
      expect(calculator.getPayout(symbol, count)).toBe(expected);
    }
  });

  it('returns 0 for an unknown symbol', () => {
    expect(calculator.getPayout('unknown', 5)).toBe(0);
  });
});
