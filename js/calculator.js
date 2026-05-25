export function calculateSplit(bill, tipPercent, people) {
  const tipAmount = bill * (tipPercent / 100);

  const grandTotal = bill + tipAmount;

  const perPerson = grandTotal / people;

  return {
    tipAmount,
    grandTotal,
    perPerson
  };
}