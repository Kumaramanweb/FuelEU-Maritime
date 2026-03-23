export function createPool(members: any[]) {
  const total = members.reduce((sum, m) => sum + m.cb, 0);

  if (total < 0) {
    throw new Error("Pool invalid: total CB < 0");
  }

  // sort descending (surplus first)
  members.sort((a, b) => b.cb - a.cb);

  let surplus = members.filter(m => m.cb > 0);
  let deficit = members.filter(m => m.cb < 0);

  for (let d of deficit) {
    for (let s of surplus) {
      if (s.cb <= 0) continue;

      const transfer = Math.min(s.cb, Math.abs(d.cb));

      s.cb -= transfer;
      d.cb += transfer;

      if (d.cb >= 0) break;
    }
  }

  return members.map(m => ({
    id: m.id,
    cb_after: m.cb,
  }));
}