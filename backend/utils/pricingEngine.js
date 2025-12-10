const PricingRule = require('../models/PricingRule');

/**
 * Dynamic Pricing Engine
 * Calculates the total price for a booking based on stacked rules
 */
class PricingEngine {

  /**
   * Main entry — Calculates total price
   */
  static async calculatePrice({ court, date, startTime, endTime, equipment = [], coach = null }) {
    if (!court || !startTime || !endTime) {
      throw new Error("Missing required pricing parameters");
    }

    const breakdown = {
      basePrice: court.basePrice,
      duration: 0,
      courtFee: 0,
      equipmentFee: 0,
      coachFee: 0,
      appliedRules: [],
      subtotal: 0,
      total: 0
    };

    const duration = this.calculateDuration(startTime, endTime);

    // Prevent negative durations due to bad inputs
    if (duration <= 0) {
      throw new Error("End time must be later than start time");
    }

    breakdown.duration = duration;

    // Base court price before rules
    let courtPrice = court.basePrice * duration;

    // Load active rules with priority consideration
    const rules = await PricingRule.find({ isActive: true }).sort({ priority: -1 });

    for (const rule of rules) {
      const adjustment = this.applyRule(rule, {
        courtPrice,
        courtType: court.type,
        date,
        startTime,
        endTime
      });

      if (adjustment !== 0) {
        courtPrice += adjustment;
        breakdown.appliedRules.push({
          id: rule._id,
          name: rule.name,
          type: rule.type,
          adjustment
        });
      }
    }

    breakdown.courtFee = courtPrice;

    /** Equipment fees */
    for (const item of equipment) {
      if (item.equipment && item.quantity > 0) {
        breakdown.equipmentFee +=
          item.equipment.pricePerHour * item.quantity * duration;
      }
    }

    /** Coach fees */
    if (coach) {
      breakdown.coachFee = coach.hourlyRate * duration;
    }

    /** Final totals */
    breakdown.subtotal = breakdown.courtFee + breakdown.equipmentFee + breakdown.coachFee;
    breakdown.total = breakdown.subtotal;

    return breakdown;
  }

  /**
   * Apply pricing rule
   */
  static applyRule(rule, { courtPrice, courtType, date, startTime }) {
    if (!rule || typeof rule !== 'object') return 0;

    // Validate modifier
    if (!['multiplier', 'fixed_addition', 'fixed_subtraction', 'percentage'].includes(rule.modifierType)) {
      console.warn(`Invalid modifierType in pricing rule: ${rule.name}`);
      return 0;
    }

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();
    const hour = parseInt(startTime.split(':')[0]);

    let isApplicable = false;

    /** Court type filtering */
    if (rule.appliesTo && rule.appliesTo !== 'all' && rule.appliesTo !== courtType) {
      return 0;
    }

    /** Rule type matching */
    switch (rule.type) {

      case 'peak_hour':
      case 'early_bird':
        if (this.timeInRange(hour, rule.startTime, rule.endTime)) {
          isApplicable = true;
        }
        break;

      case 'weekend':
        isApplicable = [0, 6].includes(dayOfWeek);
        break;

      case 'holiday':
        if (rule.specificDates?.length) {
          isApplicable = rule.specificDates.some(holiday => {
            return new Date(holiday).toDateString() === bookingDate.toDateString();
          });
        }
        break;

      case 'indoor_premium':
        isApplicable = courtType === 'indoor';
        break;

      case 'custom':
        const dayMatch = !rule.applicableDays?.length || rule.applicableDays.includes(dayOfWeek);
        const timeMatch = this.timeInRange(hour, rule.startTime, rule.endTime);
        isApplicable = dayMatch && timeMatch;
        break;
    }

    if (!isApplicable) return 0;

    /** Apply price adjustment */
    switch (rule.modifierType) {
      case 'multiplier':
        return courtPrice * (rule.modifierValue - 1);

      case 'fixed_addition':
        return rule.modifierValue;

      case 'fixed_subtraction':
        return -Math.abs(rule.modifierValue);

      case 'percentage':
        return courtPrice * (rule.modifierValue / 100);

      default:
        return 0;
    }
  }

  /**
   * Utility: check if hour falls between the rule's time range
   */
  static timeInRange(hour, start, end) {
    if (!start || !end) return true;
    const s = parseInt(start.split(':')[0]);
    const e = parseInt(end.split(':')[0]);
    return hour >= s && hour < e;
  }

  /**
   * Convert start-end times to hours duration
   */
  static calculateDuration(startTime, endTime) {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return (end - start) / 60;
  }

  /**
   * Public: Get all active rules for admin UI
   */
  static async getActiveRules() {
    return PricingRule.find({ isActive: true }).sort({ priority: -1 });
  }
}

module.exports = PricingEngine;
