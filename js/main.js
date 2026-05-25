const billInput    = document.getElementById('bill');
  const tipInput     = document.getElementById('tip');
  const peopleInput  = document.getElementById('people');
  const presetBtns   = document.querySelectorAll('.preset-btn');
  const decBtn       = document.getElementById('dec-btn');
  const incBtn       = document.getElementById('inc-btn');
  const resetBtn     = document.getElementById('reset-btn');
  const peopleStepper = document.getElementById('people-stepper');

  const perPersonVal  = document.getElementById('per-person-value');
  const perPersonNote = document.getElementById('per-person-note');
  const billDisplay   = document.getElementById('bill-display');
  const tipDisplay    = document.getElementById('tip-display');
  const totalDisplay  = document.getElementById('total-display');

  const billError    = document.getElementById('bill-error');
  const tipError     = document.getElementById('tip-error');
  const peopleError  = document.getElementById('people-error');

  const MAX_TIP = 100;
  const CURRENCY = 'Rs';

  let activePreset = null;

  function fmt(n) {
    return n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function setError(el, inputEl, msg) {
    if (msg) {
      el.textContent = msg;
      el.classList.add('visible');
      inputEl.classList.add('error');
      if (inputEl.closest('.people-stepper')) {
        peopleStepper.classList.add('error');
      }
      inputEl.setAttribute('aria-invalid', 'true');
    } else {
      el.classList.remove('visible');
      inputEl.classList.remove('error');
      if (inputEl.closest('.people-stepper')) {
        peopleStepper.classList.remove('error');
      }
      inputEl.removeAttribute('aria-invalid');
    }
  }

  function validateBill(raw) {
    if (raw === '' || raw === null) return { ok: false, msg: 'Enter a bill amount' };
    const v = parseFloat(raw);
    if (isNaN(v)) return { ok: false, msg: 'Enter a valid number' };
    if (v < 0)   return { ok: false, msg: 'Amount can\'t be negative' };
    if (v === 0) return { ok: false, msg: 'Amount must be greater than 0' };
    if (v > 9_999_999) return { ok: false, msg: 'That\'s a big bill! Max Rs 9,999,999' };
    return { ok: true, value: v };
  }

  function validateTip(raw) {
    if (raw === '' || raw === null) return { ok: false, msg: null, value: 0 };
    const v = parseFloat(raw);
    if (isNaN(v))   return { ok: false, msg: 'Enter a valid number', value: null };
    if (v < 0)      return { ok: false, msg: 'Tip can\'t be negative', value: null };
    if (v > MAX_TIP) return { ok: false, msg: `Max tip is ${MAX_TIP}%`, value: null };
    return { ok: true, msg: null, value: v };
  }

  function validatePeople(raw) {
    if (raw === '' || raw === null) return { ok: false, msg: 'Enter number of people' };
    const v = Number(raw);
    if (!Number.isInteger(v) || isNaN(v)) return { ok: false, msg: 'Must be a whole number' };
    if (v < 1)   return { ok: false, msg: 'At least 1 person' };
    if (v > 999) return { ok: false, msg: 'Max 999 people' };
    return { ok: true, value: v };
  }

  function calculate() {
    const billRaw   = billInput.value.trim();
    const tipRaw    = tipInput.value.trim();
    const peopleRaw = peopleInput.value.trim();

    const bv = validateBill(billRaw);
    const tv = validateTip(tipRaw);
    const pv = validatePeople(peopleRaw);

    setError(billError,   billInput,   bv.ok ? '' : bv.msg);
    setError(tipError,    tipInput,    tv.msg || '');
    setError(peopleError, peopleInput, pv.ok ? '' : pv.msg);

    if (!bv.ok || !tv.ok || !pv.ok) {
      showEmpty();
      return;
    }

    const bill    = bv.value;
    const tipPct  = tv.value;
    const people  = pv.value;

    const tipAmt   = bill * (tipPct / 100);
    const total    = bill + tipAmt;

    // Rounding policy: round up to next cent so the group never underpays
    // Then distribute any remainder: first (remainder) people pay 1 paisa more
    const rawPer    = total / people;
    const floorPer  = Math.floor(rawPer * 100) / 100;
    const remainder = Math.round((rawPer - floorPer) * 100 * people);

    let noteText = '';
    if (remainder > 0 && people > 1) {
      noteText = `${remainder} of ${people} pay Rs ${fmt(floorPer + 0.01)}`;
    }

    perPersonVal.textContent  = fmt(floorPer + (remainder > 0 ? 0.01 : 0));
    perPersonNote.textContent = noteText;
    billDisplay.textContent   = `${CURRENCY} ${fmt(bill)}`;
    tipDisplay.textContent    = `${CURRENCY} ${fmt(tipAmt)}`;
    totalDisplay.textContent  = `${CURRENCY} ${fmt(total)}`;

    // Accessible description
    document.getElementById('per-person-display').setAttribute(
      'aria-label',
      `Amount per person: ${CURRENCY} ${fmt(floorPer + (remainder > 0 ? 0.01 : 0))}`
    );
  }

  function showEmpty() {
    perPersonVal.textContent  = '—';
    perPersonNote.textContent = '';
    billDisplay.textContent   = `${CURRENCY} —`;
    tipDisplay.textContent    = `${CURRENCY} —`;
    totalDisplay.textContent  = `${CURRENCY} —`;
  }

  function setPreset(pct) {
    tipInput.value = pct;
    activePreset = pct;
    presetBtns.forEach(b => {
      const isActive = Number(b.dataset.tip) === pct;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function clearPreset() {
    activePreset = null;
    presetBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pct = Number(btn.dataset.tip);
      if (activePreset === pct) {
        clearPreset();
        tipInput.value = '';
      } else {
        setPreset(pct);
      }
      tipInput.focus();
      calculate();
    });
  });

  tipInput.addEventListener('input', () => {
    clearPreset();
    calculate();
  });

  billInput.addEventListener('input', calculate);
  peopleInput.addEventListener('input', calculate);

  decBtn.addEventListener('click', () => {
    const v = parseInt(peopleInput.value) || 2;
    if (v > 1) { peopleInput.value = v - 1; calculate(); }
  });

  incBtn.addEventListener('click', () => {
    const v = parseInt(peopleInput.value) || 1;
    if (v < 999) { peopleInput.value = v + 1; calculate(); }
  });

  resetBtn.addEventListener('click', () => {
    billInput.value   = '';
    tipInput.value    = '';
    peopleInput.value = '2';
    clearPreset();
    setError(billError,   billInput,   '');
    setError(tipError,    tipInput,    '');
    setError(peopleError, peopleInput, '');
    showEmpty();
    billInput.focus();
  });

  // Prevent non-numeric paste from silently passing through
  [billInput, tipInput, peopleInput].forEach(input => {
    input.addEventListener('paste', (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^-?\d*\.?\d*$/.test(pasted.trim())) {
        e.preventDefault();
      }
    });

    // Prevent e, +, - on number fields (except bill allows decimal)
    input.addEventListener('keydown', (e) => {
      if (['e', 'E'].includes(e.key)) e.preventDefault();
      if (input === peopleInput && ['.', '-', '+'].includes(e.key)) e.preventDefault();
      if (input === billInput && ['-', '+'].includes(e.key)) e.preventDefault();
      if (input === tipInput && ['-', '+'].includes(e.key)) e.preventDefault();
    });
  });

  // Set initial state
  calculate();