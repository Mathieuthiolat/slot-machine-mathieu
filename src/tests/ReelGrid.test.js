import { describe, it, expect } from 'vitest';

import { bands } from '../config/bands.js';


const VISIBLE_ROWS = 3;

function getVisibleSymbols(band, position) {
  const result = [];
  for (let row = 0; row < VISIBLE_ROWS; row++) {
    result.push(band[(position + row) % band.length]);
  }
  return result;
}

function getGrid(positions) {
  return bands.map((band, i) => getVisibleSymbols(band, positions[i]));
}


describe('Band definitions', () => {
  it('each of the 5 bands has exactly 20 symbols', () => {
    bands.forEach((band, i) => {
      expect(band, `Band ${i} length`).toHaveLength(20);
    });
  });

  it('each band only contains valid symbol ids', () => {
    const valid = new Set(['hv1','hv2','hv3','hv4','lv1','lv2','lv3','lv4']);
    bands.forEach((band, i) => {
      band.forEach(sym => {
        expect(valid.has(sym), `Band ${i} contains unknown symbol "${sym}"`).toBe(true);
      });
    });
  });
});


describe('getVisibleSymbols', () => {
  it('returns exactly 3 symbols', () => {
    expect(getVisibleSymbols(bands[0], 0)).toHaveLength(3);
  });

  it('starts from the given position', () => {
    const result = getVisibleSymbols(bands[0], 0);
    expect(result[0]).toBe(bands[0][0]); // hv2
    expect(result[1]).toBe(bands[0][1]); // lv3
    expect(result[2]).toBe(bands[0][2]); // lv3
  });

  it('wraps around correctly at position 19 (last index)', () => {
    const result = getVisibleSymbols(bands[0], 19);
    expect(result[0]).toBe(bands[0][19]); // hv2
    expect(result[1]).toBe(bands[0][0]);  // wraps → hv2
    expect(result[2]).toBe(bands[0][1]);  // wraps → lv3
  });

  it('wraps around correctly at position 18', () => {
    const result = getVisibleSymbols(bands[0], 18);
    expect(result[0]).toBe(bands[0][18]); // lv3
    expect(result[1]).toBe(bands[0][19]); // hv2
    expect(result[2]).toBe(bands[0][0]);  // wraps → hv2
  });
});


describe('getGrid — spec examples', () => {
  it('positions [0,0,0,0,0] matches the spec initial screen', () => {
    const grid = getGrid([0, 0, 0, 0, 0]);
    expect(grid.map(col => col[0])).toEqual(['hv2','hv1','lv1','hv2','lv3']);
    expect(grid.map(col => col[1])).toEqual(['lv3','lv2','hv2','lv2','lv4']);
    expect(grid.map(col => col[2])).toEqual(['lv3','lv3','lv3','hv3','hv2']);
  });

  it('positions [18,9,2,0,12] matches the spec screen', () => {
    const grid = getGrid([18, 9, 2, 0, 12]);
    expect(grid.map(col => col[0])).toEqual(['lv3','hv4','lv3','hv2','lv2']);
    expect(grid.map(col => col[1])).toEqual(['hv2','lv3','lv4','lv2','hv4']);
    expect(grid.map(col => col[2])).toEqual(['hv2','hv2','hv3','hv3','hv1']);
  });
});