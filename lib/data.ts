// Real numbers exported from the Catan Bot Lab repo.

/**
 * Win rate (%) against the three strongest tuned strategy bots
 * (Balanced, Ore-Wheat-Sheep, Road Builder) during training.
 * Source: results/training/{main,phase2}_metrics.jsonl, 512–2,048-game
 * evaluations, 7-point rolling mean. Phase 2 starts at update 8,000.
 */
export const trainingCurve: [number, number][] = [[50,4.69],[150,5.4],[250,6.53],[350,7.62],[450,8.82],[550,10.07],[650,10.49],[750,10.99],[850,11.08],[950,11.69],[1050,12.89],[1150,14.03],[1250,15.09],[1350,15.85],[1450,15.46],[1550,15.43],[1650,15.49],[1750,15.54],[1850,15.79],[1950,16.13],[2050,15.76],[2150,15.71],[2250,15.76],[2350,16.35],[2450,16.29],[2550,16.24],[2650,16.8],[2750,17.88],[2850,18.75],[2950,18.83],[3050,18.47],[3150,17.77],[3250,18.11],[3350,18.02],[3450,18.16],[3550,18.58],[3650,18.42],[3750,19.17],[3850,18.72],[3950,19.25],[4050,19.7],[4150,19.48],[4250,19.31],[4350,19.17],[4450,18.92],[4550,19.61],[4650,20.23],[4750,19.78],[4850,20.42],[4950,20.7],[5050,20.7],[5150,21.29],[5250,20.81],[5350,20.45],[5450,20.59],[5550,20.48],[5650,21.01],[5750,20.93],[5850,20.48],[5950,19.75],[6050,19.36],[6150,19.22],[6250,18.72],[6350,18.97],[6450,19.17],[6550,19.14],[6650,20.34],[6750,21.29],[6850,22.43],[6950,22.8],[7050,22.63],[7150,23.19],[7250,22.74],[7350,22.68],[7450,22.96],[7550,22.66],[7650,22.52],[7750,22.38],[7850,22.66],[7950,23.74],[8100,24.02],[8300,24.57],[8500,25.23],[8700,26.18],[8900,26.87],[9100,27.06],[9300,27.16],[9500,27.35],[9700,27.5],[9900,27.3],[10100,27.17],[10300,27.31],[10500,27.53],[10700,27.81],[10900,28.16],[11000,28.09]];

export const trainingStages = [
  { from: 0, to: 1815, label: "Curriculum" },
  { from: 1815, to: 8000, label: "Self-play league" },
  { from: 8000, to: 11000, label: "Phase 2 · focus" },
];

/** Final, held-out evaluation (40,448 games, all seats rotated). */
export const finalEval = {
  lookahead: 36.1,
  lookaheadCi: [35.6, 36.6] as [number, number],
  phase2: 29.8,
  balancedInSeat: 28.9,
  breakEven: 25,
};

/** 2,000,000-game tournament, tuned bots, random 4-of-5 tables. */
export const tournament = [
  { name: "Balanced", win: 37.6, lo: 37.6, hi: 37.7, how: "Longest Road in 53% of its wins" },
  { name: "Ore-Wheat-Sheep", win: 28.7, lo: 28.6, hi: 28.7, how: "2.5 cities per game" },
  { name: "Road Builder", win: 22.9, lo: 22.9, hi: 23.0, how: "Longest Road in 96% of its wins" },
  { name: "Dev-Card Rush", win: 20.3, lo: 20.2, hi: 20.3, how: "7.8 dev cards per game" },
  { name: "Port Master", win: 15.5, lo: 15.5, hi: 15.6, how: "9.1 bank trades per game" },
];

export function curveAt(u: number): number {
  const c = trainingCurve;
  if (u <= c[0][0]) return c[0][1];
  for (let i = 1; i < c.length; i++) {
    if (u <= c[i][0]) {
      const [x0, y0] = c[i - 1];
      const [x1, y1] = c[i];
      return y0 + ((y1 - y0) * (u - x0)) / (x1 - x0);
    }
  }
  return c[c.length - 1][1];
}
