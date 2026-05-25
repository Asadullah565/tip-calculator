import { MAX_TIP } from './constants.js';

export function validateBill(raw) {
  if (raw === '' || raw === null) {
    return {
      ok: false,
      msg: 'Enter a bill amount'
    };
  }

  const value = parseFloat(raw);

  if (isNaN(value)) {
    return {
      ok: false,
      msg: 'Enter a valid number'
    };
  }

  if (value < 0) {
    return {
      ok: false,
      msg: 'Amount cannot be negative'
    };
  }

  if (value === 0) {
    return {
      ok: false,
      msg: 'Amount must be greater than 0'
    };
  }

  if (value > 9999999) {
    return {
      ok: false,
      msg: 'Maximum bill is Rs 9,999,999'
    };
  }

  return {
    ok: true,
    value
  };
}

export function validateTip(raw) {
  if (raw === '' || raw === null) {
    return {
      ok: true,
      value: 0,
      msg: ''
    };
  }

  const value = parseFloat(raw);

  if (isNaN(value)) {
    return {
      ok: false,
      msg: 'Enter a valid tip percentage'
    };
  }

  if (value < 0) {
    return {
      ok: false,
      msg: 'Tip cannot be negative'
    };
  }

  if (value > MAX_TIP) {
    return {
      ok: false,
      msg: `Maximum tip is ${MAX_TIP}%`
    };
  }

  return {
    ok: true,
    value
  };
}

export function validatePeople(raw) {
  if (raw === '' || raw === null) {
    return {
      ok: false,
      msg: 'Enter number of people'
    };
  }

  const value = Number(raw);

  if (isNaN(value) || !Number.isInteger(value)) {
    return {
      ok: false,
      msg: 'Must be a whole number'
    };
  }

  if (value < 1) {
    return {
      ok: false,
      msg: 'At least 1 person required'
    };
  }

  if (value > 999) {
    return {
      ok: false,
      msg: 'Maximum 999 people'
    };
  }

  return {
    ok: true,
    value
  };
}