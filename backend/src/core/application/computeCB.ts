const TARGET = 89.3368;

export function computeCB(ghg: number, fuel: number) {
  const energy = fuel * 41000;
  return (TARGET - ghg) * energy;
}