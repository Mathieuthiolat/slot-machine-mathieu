export class WinCalculator {
  constructor({ paylines, paytable }) {
    this.paylines = paylines;
    this.paytable = paytable;
  }

  calculate(grid) {
    const wins = [];
    let total = 0;

    for (const payline of this.paylines) {
      const result = this.evaluatePayline(grid, payline);

      if (result.payout > 0) {
        wins.push(result);
        total += result.payout;
      }
    }

    return {
      total,
      wins,
    };
  }

  evaluatePayline(grid, payline) {
    const firstPosition = payline.positions[0];
    const firstSymbol = grid[firstPosition[0]][firstPosition[1]];

    let count = 1;

    for (let i = 1; i < payline.positions.length; i++) {
      const [reelIndex, rowIndex] = payline.positions[i];
      const currentSymbol = grid[reelIndex][rowIndex];

      if (currentSymbol !== firstSymbol) {
        break;
      }

      count++;
    }

    const payout = this.getPayout(firstSymbol, count);

    return {
      paylineId: payline.id,
      symbol: firstSymbol,
      count,
      payout,
    };
  }

  getPayout(symbol, count) {
    if (count < 3) {
      return 0;
    }

    return this.paytable[symbol]?.[count] ?? 0;
  }
}