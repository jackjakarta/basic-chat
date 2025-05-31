export function convertCentAmountToEuro(amount: number): string {
  if (amount < 0) {
    throw new Error('Amount cannot be negative');
  }

  return (amount / 100).toFixed(2).replace('.', ',') + ' €';
}
