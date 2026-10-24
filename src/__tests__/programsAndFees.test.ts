import { describe, it, expect } from 'vitest';
import { INITIAL_PROGRAMS, INITIAL_FEES, INITIAL_CHECKLIST } from '../data/mockData';

describe('Programs and Fees Validation', () => {
  it('should have accredited undergraduate and postgraduate programs', () => {
    const undergrads = INITIAL_PROGRAMS.filter(p => p.level === 'undergraduate');
    const postgrads = INITIAL_PROGRAMS.filter(p => p.level === 'postgraduate');

    expect(undergrads.length).toBeGreaterThan(0);
    expect(postgrads.length).toBeGreaterThan(0);
  });

  it('should accurately calculate total fee from individual fee components', () => {
    INITIAL_FEES.forEach(fee => {
      const computedTotal = fee.tuitionFee + fee.developmentFee + fee.otherCharges;
      expect(fee.totalFee).toBe(computedTotal);
    });
  });

  it('should have valid official sources for fee records', () => {
    INITIAL_FEES.forEach(fee => {
      expect(fee.officialSource).toBeDefined();
      expect(fee.officialSource.length).toBeGreaterThan(5);
      expect(fee.deadline).toBeDefined();
    });
  });

  it('should have structured checklist items with toggled states', () => {
    expect(INITIAL_CHECKLIST.length).toBeGreaterThanOrEqual(6);
    const completedItems = INITIAL_CHECKLIST.filter(c => c.completed);
    expect(completedItems.length).toBeGreaterThanOrEqual(1);
  });
});
