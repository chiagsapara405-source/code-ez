export type DiffLine = {
  type: "same" | "add" | "remove";
  text: string;
  oldNo?: number;
  newNo?: number;
};

// Simple LCS-based line diff
export function diffLines(a: string, b: string): DiffLine[] {
  const aLines = a.replace(/\r\n/g, "\n").split("\n");
  const bLines = b.replace(/\r\n/g, "\n").split("\n");
  const n = aLines.length;
  const m = bLines.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (aLines[i] === bLines[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0,
    j = 0,
    oldNo = 1,
    newNo = 1;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      out.push({ type: "same", text: aLines[i], oldNo: oldNo++, newNo: newNo++ });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "remove", text: aLines[i], oldNo: oldNo++ });
      i++;
    } else {
      out.push({ type: "add", text: bLines[j], newNo: newNo++ });
      j++;
    }
  }
  while (i < n) out.push({ type: "remove", text: aLines[i++], oldNo: oldNo++ });
  while (j < m) out.push({ type: "add", text: bLines[j++], newNo: newNo++ });
  return out;
}

export function diffStats(lines: DiffLine[]) {
  let added = 0,
    removed = 0;
  for (const l of lines) {
    if (l.type === "add") added++;
    else if (l.type === "remove") removed++;
  }
  return { added, removed };
}