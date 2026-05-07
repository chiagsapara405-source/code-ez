export const xpForLevel = (level: number) => 100 * level * (level + 1) / 2;

export const computeLevel = (totalXp: number) => {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) level++;
  return level;
};

export const levelProgress = (totalXp: number) => {
  const level = computeLevel(totalXp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = totalXp - base;
  const span = next - base;
  return { level, into, span, percent: Math.round((into / span) * 100) };
};