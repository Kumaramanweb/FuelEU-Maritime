export function canBank(cb: number) {
  return cb > 0;
}

export function applyBank(bank: number, deficit: number) {
  if (bank <= 0) throw new Error("No bank available");

  const applied = Math.min(bank, Math.abs(deficit));

  return {
    applied,
    remainingBank: bank - applied,
    newDeficit: deficit + applied,
  };
}