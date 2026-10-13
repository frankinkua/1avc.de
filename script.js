document.addEventListener('DOMContentLoaded', () => {
  const preMoneyInput = document.getElementById('pre-money');
  const investmentInput = document.getElementById('investment');
  const esopInput = document.getElementById('esop');

  const postMoneyDisplay = document.getElementById('post-money-val');
  const founderDilutionDisplay = document.getElementById('founder-dilution');
  const newInvestorShareDisplay = document.getElementById('new-investor-share');

  function parseNumber(value) {
    // Basic parse assuming numbers might be large
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function formatCurrency(value) {
    if (value >= 1000000) {
      return '€' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return '€' + (value / 1000).toFixed(0) + 'k';
    }
    return '€' + value.toLocaleString('de-DE');
  }

  function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
  }

  function calculateDilution() {
    if (!preMoneyInput || !investmentInput || !esopInput) return;

    const preMoney = parseNumber(preMoneyInput.value);
    const investment = parseNumber(investmentInput.value);
    const esopPercent = parseNumber(esopInput.value) / 100;

    if (preMoney === 0) {
        postMoneyDisplay.textContent = '-';
        founderDilutionDisplay.textContent = '-';
        newInvestorShareDisplay.textContent = '-';
        return;
    }

    const postMoney = preMoney + investment;
    const newInvestorShare = investment / postMoney;

    // Simplistic model: Founders owned 100% before.
    // Now they get diluted by new investor and new ESOP pool (which usually comes out of pre-money valuation, effectively diluting founders more).
    // Let's assume the new ESOP is created post-money to reach the target esopPercent of the fully diluted post-money cap table.

    // Founders share = 100% - Investor Share - ESOP Share
    const foundersShare = 1 - newInvestorShare - esopPercent;

    // Display
    postMoneyDisplay.textContent = formatCurrency(postMoney);

    if (foundersShare > 0) {
        founderDilutionDisplay.textContent = formatPercent(foundersShare);
    } else {
        founderDilutionDisplay.textContent = "0.0%"; // Diluted below 0 shouldn't happen realistically but handle gracefully
    }

    newInvestorShareDisplay.textContent = formatPercent(newInvestorShare);
  }

  // Listeners
  if (preMoneyInput && investmentInput && esopInput) {
    preMoneyInput.addEventListener('input', calculateDilution);
    investmentInput.addEventListener('input', calculateDilution);
    esopInput.addEventListener('input', calculateDilution);

    // Initial calc
    calculateDilution();
  }
});
