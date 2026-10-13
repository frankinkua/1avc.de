document.addEventListener('DOMContentLoaded', () => {
  // Inputs
  const currentEsopInput = document.getElementById('current-esop');

  // Round 1 (e.g. Seed)
  const r1PreMoneyInput = document.getElementById('r1-pre-money');
  const r1InvestmentInput = document.getElementById('r1-investment');
  const r1EsopInput = document.getElementById('r1-esop');

  // Round 2 (e.g. Series A)
  const r2PreMoneyInput = document.getElementById('r2-pre-money');
  const r2InvestmentInput = document.getElementById('r2-investment');
  const r2EsopInput = document.getElementById('r2-esop');

  // Outputs Round 1
  const r1FoundersShare = document.getElementById('r1-founders-share');
  const r1InvestorsShare = document.getElementById('r1-investors-share');
  const r1TotalEsop = document.getElementById('r1-total-esop');

  // Outputs Round 2
  const r2FoundersShare = document.getElementById('r2-founders-share');
  const r2Investors1Share = document.getElementById('r2-investors1-share');
  const r2Investors2Share = document.getElementById('r2-investors2-share');
  const r2TotalEsop = document.getElementById('r2-total-esop');

  // Bars
  const barFounders = document.getElementById('bar-founders');
  const barInvestors1 = document.getElementById('bar-investors1');
  const barInvestors2 = document.getElementById('bar-investors2');
  const barEsop = document.getElementById('bar-esop');

  function parseNumber(value) {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
  }

  function updateBarSegment(el, percentage) {
    if (!el) return;
    const p = percentage * 100;
    el.style.width = p + '%';
    el.textContent = p > 5 ? p.toFixed(1) + '%' : ''; // Only show text if wide enough
  }

  function calculateDilution() {
    if (!r1PreMoneyInput) return;

    const currentEsop = parseNumber(currentEsopInput.value) / 100;

    // Round 1
    const r1PreMoney = parseNumber(r1PreMoneyInput.value);
    const r1Investment = parseNumber(r1InvestmentInput.value);
    const r1NewEsop = parseNumber(r1EsopInput.value) / 100;

    let r1Founders = 1 - currentEsop;
    let r1Investors = 0;
    let r1EsopTarget = currentEsop + r1NewEsop;

    if (r1PreMoney > 0) {
      const r1PostMoney = r1PreMoney + r1Investment;
      const r1InvestorDilution = r1Investment / r1PostMoney;

      // Target ESOP is typically defined post-money.
      // The dilution from new investors and new ESOP comes out of existing shareholders (founders + old ESOP).
      // Simplification: Founders and existing ESOP get diluted proportionately by new money and new ESOP pool increase.

      r1Investors = r1InvestorDilution;

      // Calculate remaining pool for existing shareholders
      const remainingShareR1 = 1 - r1Investors - r1NewEsop;

      // Dilute founders and existing ESOP
      r1Founders = (1 - currentEsop) * remainingShareR1;
      r1EsopTarget = (currentEsop * remainingShareR1) + r1NewEsop;
    }

    // Update R1 Displays
    r1FoundersShare.textContent = formatPercent(Math.max(0, r1Founders));
    r1InvestorsShare.textContent = formatPercent(r1Investors);
    r1TotalEsop.textContent = formatPercent(r1EsopTarget);

    // Round 2
    const r2PreMoney = parseNumber(r2PreMoneyInput.value);
    const r2Investment = parseNumber(r2InvestmentInput.value);
    const r2NewEsop = parseNumber(r2EsopInput.value) / 100;

    let r2Founders = r1Founders;
    let r2Investors1 = r1Investors;
    let r2Investors2 = 0;
    let r2EsopTarget = r1EsopTarget + r2NewEsop;

    if (r2PreMoney > 0 && r2Investment > 0) {
      const r2PostMoney = r2PreMoney + r2Investment;
      const r2InvestorDilution = r2Investment / r2PostMoney;

      r2Investors2 = r2InvestorDilution;

      const remainingShareR2 = 1 - r2Investors2 - r2NewEsop;

      // Dilute existing shareholders from R1
      r2Founders = r1Founders * remainingShareR2;
      r2Investors1 = r1Investors * remainingShareR2;
      r2EsopTarget = (r1EsopTarget * remainingShareR2) + r2NewEsop;
    }

    // Ensure we don't go negative
    r2Founders = Math.max(0, r2Founders);

    // Update R2 Displays
    r2FoundersShare.textContent = formatPercent(r2Founders);
    r2Investors1Share.textContent = formatPercent(r2Investors1);
    if(r2Investors2Share) r2Investors2Share.textContent = formatPercent(r2Investors2);
    if(r2TotalEsop) r2TotalEsop.textContent = formatPercent(r2EsopTarget);

    // Update Stacked Bar based on Final (R2) state
    updateBarSegment(barFounders, r2Founders);
    updateBarSegment(barInvestors1, r2Investors1);
    updateBarSegment(barInvestors2, r2Investors2);
    updateBarSegment(barEsop, r2EsopTarget);
  }

  // Listeners
  const inputs = [currentEsopInput, r1PreMoneyInput, r1InvestmentInput, r1EsopInput, r2PreMoneyInput, r2InvestmentInput, r2EsopInput];
  inputs.forEach(input => {
    if (input) input.addEventListener('input', calculateDilution);
  });

  // Initial calc
  calculateDilution();
});
