'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface MortgageCalculatorProps {
  price: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ price }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [years, setYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);

  const { t, interpolate } = useLanguage();

  const safePrice = price > 0 ? price : 1000000;
  const downPaymentAmount = (safePrice * downPaymentPct) / 100;
  const loanAmount = safePrice - downPaymentAmount;

  // Monthly mortgage calculation: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = years * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(monthlyPayment));

  return (
    <>
      <div className="bg-mosque/5 dark:bg-white/5 p-6 rounded-xl border border-mosque/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-white/10 rounded-full text-mosque dark:text-hint-of-green shadow-sm">
            <span className="material-icons">calculate</span>
          </div>
          <div>
            <h3 className="font-semibold text-nordic dark:text-white">
              {t.mortgage.estimatedPayment}
            </h3>
            <p className="text-sm text-nordic/60 dark:text-hint-of-green/70">
              {t.mortgage.startingFrom}{' '}
              <strong className="text-mosque dark:text-hint-of-green">
                {formattedMonthly}
                {t.mortgage.perMonth}
              </strong>{' '}
              {interpolate(t.mortgage.withDown, { percent: downPaymentPct })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="whitespace-nowrap px-4 py-2 bg-white dark:bg-white/10 border border-nordic/10 dark:border-white/20 rounded-lg text-sm font-semibold hover:border-mosque dark:hover:border-hint-of-green transition-colors text-nordic dark:text-white cursor-pointer"
        >
          {t.mortgage.calculateMortgage}
        </button>
      </div>

      {/* Interactive Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#162e2a] text-nordic dark:text-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-mosque/10 relative animate-fadeIn">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-nordic/50 hover:text-nordic dark:text-white/50 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={t.common.close}
            >
              <span className="material-icons">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-mosque/10 dark:bg-hint-of-green/20 text-mosque dark:text-hint-of-green rounded-full">
                <span className="material-icons">calculate</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t.mortgage.calculatorTitle}</h3>
                <p className="text-xs text-nordic/60 dark:text-white/60">
                  {t.mortgage.propertyPrice} ${safePrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Calculated summary card */}
            <div className="p-5 bg-mosque/10 dark:bg-hint-of-green/10 rounded-xl mb-6 text-center">
              <span className="text-xs uppercase font-semibold text-nordic/60 dark:text-hint-of-green/80">
                {t.mortgage.estimatedMonthlyPayment}
              </span>
              <div className="text-4xl font-bold text-mosque dark:text-hint-of-green my-1">
                {formattedMonthly}
                <span className="text-sm font-normal text-nordic/60 dark:text-white/60">
                  {t.mortgage.perMonth}
                </span>
              </div>
              <p className="text-xs text-nordic/60 dark:text-white/60">
                {interpolate(t.mortgage.loanBreakdown, {
                  loan: loanAmount.toLocaleString(),
                  down: downPaymentAmount.toLocaleString(),
                })}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              {/* Down payment slider */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>{t.mortgage.downPaymentLabel}</span>
                  <span className="text-mosque dark:text-hint-of-green font-bold">
                    {downPaymentPct}% (${downPaymentAmount.toLocaleString()})
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-mosque cursor-pointer"
                />
              </div>

              {/* Loan Term */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>{t.mortgage.loanTermLabel}</span>
                  <span className="text-mosque dark:text-hint-of-green font-bold">
                    {interpolate(t.mortgage.years, { years })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setYears(term)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        years === term
                          ? 'bg-mosque text-white border-mosque dark:bg-hint-of-green dark:text-nordic'
                          : 'border-nordic/10 dark:border-white/10 hover:border-mosque dark:hover:border-hint-of-green'
                      }`}
                    >
                      {interpolate(t.mortgage.years, { years: term })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest rate */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>{t.mortgage.interestRateLabel}</span>
                  <span className="text-mosque dark:text-hint-of-green font-bold">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="12.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-mosque cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-mosque hover:bg-primary-hover dark:bg-hint-of-green dark:hover:bg-hint-of-green/90 text-white dark:text-nordic py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              {t.mortgage.doneButton}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
