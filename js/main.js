import {
  validateBill,
  validateTip,
  validatePeople
} from './validation.js';

import {
  calculateSplit
} from './calculator.js';

import {
  setError,
  showEmpty,
  updateResults,
  setActivePreset,
  clearActivePreset
} from './ui.js';

const billInput = document.getElementById('bill');

const tipInput = document.getElementById('tip');

const peopleInput = document.getElementById('people');

const presetButtons =
  document.querySelectorAll('.preset-btn');

const decBtn =
  document.getElementById('dec-btn');

const incBtn =
  document.getElementById('inc-btn');

const resetBtn =
  document.getElementById('reset-btn');

const perPersonValue =
  document.getElementById('per-person-value');

const perPersonNote =
  document.getElementById('per-person-note');

const billDisplay =
  document.getElementById('bill-display');

const tipDisplay =
  document.getElementById('tip-display');

const totalDisplay =
  document.getElementById('total-display');

const billError =
  document.getElementById('bill-error');

const tipError =
  document.getElementById('tip-error');

const peopleError =
  document.getElementById('people-error');

function runCalculation() {
  const billValidation =
    validateBill(billInput.value.trim());

  const tipValidation =
    validateTip(tipInput.value.trim());

  const peopleValidation =
    validatePeople(peopleInput.value.trim());

  setError(
    billError,
    billInput,
    billValidation.ok ? '' : billValidation.msg
  );

  setError(
    tipError,
    tipInput,
    tipValidation.ok ? '' : tipValidation.msg
  );

  setError(
    peopleError,
    peopleInput,
    peopleValidation.ok ? '' : peopleValidation.msg
  );

  if (
    !billValidation.ok ||
    !tipValidation.ok ||
    !peopleValidation.ok
  ) {
    showEmpty({
      perPersonValue,
      perPersonNote,
      billDisplay,
      tipDisplay,
      totalDisplay
    });

    return;
  }

  const results = calculateSplit(
    billValidation.value,
    tipValidation.value,
    peopleValidation.value
  );

  updateResults({
    perPersonValue,
    perPersonNote,
    billDisplay,
    tipDisplay,
    totalDisplay,
    bill: billValidation.value,
    tipAmount: results.tipAmount,
    grandTotal: results.grandTotal,
    perPerson: results.perPerson,
    people: peopleValidation.value
  });
}

presetButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tipValue =
      Number(button.dataset.tip);

    tipInput.value = tipValue;

    setActivePreset(
      presetButtons,
      tipValue
    );

    runCalculation();
  });
});

tipInput.addEventListener('input', () => {
  clearActivePreset(presetButtons);

  runCalculation();
});

billInput.addEventListener(
  'input',
  runCalculation
);

peopleInput.addEventListener(
  'input',
  runCalculation
);

decBtn.addEventListener('click', () => {
  let value =
    parseInt(peopleInput.value) || 1;

  if (value > 1) {
    peopleInput.value = value - 1;

    runCalculation();
  }
});

incBtn.addEventListener('click', () => {
  let value =
    parseInt(peopleInput.value) || 1;

  if (value < 999) {
    peopleInput.value = value + 1;

    runCalculation();
  }
});

resetBtn.addEventListener('click', () => {
  billInput.value = '';

  tipInput.value = '';

  peopleInput.value = '2';

  clearActivePreset(presetButtons);

  setError(billError, billInput, '');

  setError(tipError, tipInput, '');

  setError(peopleError, peopleInput, '');

  showEmpty({
    perPersonValue,
    perPersonNote,
    billDisplay,
    tipDisplay,
    totalDisplay
  });

  billInput.focus();
});

runCalculation();