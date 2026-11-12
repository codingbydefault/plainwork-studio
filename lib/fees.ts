export function applicationFee(amountMinor: number) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new Error("Invalid amount");
  return Math.round(amountMinor / 100);
}
