import { CURRENCY } from './constants.js';

export function formatCurrency(value) {
  return value.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function setError(errorElement, inputElement, message) {
  if (message) {
    errorElement.textContent = message;

    errorElement.classList.add('visible');

    inputElement.classList.add('error');

    inputElement.setAttribute('aria-invalid', 'true');
  } else {
    errorElement.textContent = '';

    errorElement.classList.remove('visible');

    inputElement.classList.remove('error');

    inputElement.removeAttribute('aria-invalid');
  }
}

export function showEmpty({
  perPersonValue,
  perPersonNote,
  billDisplay,
  tipDisplay,
  totalDisplay
}) {
  perPersonValue.textContent = '—';

  perPersonNote.textContent = '';

  billDisplay.textContent = `${CURRENCY} —`;

  tipDisplay.textContent = `${CURRENCY} —`;

  totalDisplay.textContent = `${CURRENCY} —`;
}

export function updateResults({
  perPersonValue,
  perPersonNote,
  billDisplay,
  tipDisplay,
  totalDisplay,
  bill,
  tipAmount,
  grandTotal,
  perPerson,
  people
}) {
  const roundedPerPerson = Number(perPerson.toFixed(2));

  perPersonValue.textContent =
    formatCurrency(roundedPerPerson);

  perPersonNote.textContent =
    `Split between ${people} people`;

  billDisplay.textContent =
    `${CURRENCY} ${formatCurrency(bill)}`;

  tipDisplay.textContent =
    `${CURRENCY} ${formatCurrency(tipAmount)}`;

  totalDisplay.textContent =
    `${CURRENCY} ${formatCurrency(grandTotal)}`;
}

export function setActivePreset(buttons, activeValue) {
  buttons.forEach(button => {
    const isActive =
      Number(button.dataset.tip) === activeValue;

    button.classList.toggle('active', isActive);

    button.setAttribute(
      'aria-pressed',
      isActive ? 'true' : 'false'
    );
  });
}

export function clearActivePreset(buttons) {
  buttons.forEach(button => {
    button.classList.remove('active');

    button.setAttribute('aria-pressed', 'false');
  });
}