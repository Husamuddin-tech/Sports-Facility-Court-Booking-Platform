const Booking = require("../models/Booking");

class AvailabilityChecker {

//  ⏱ TIME SLOT HELPERS

  static toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  static timeSlotsOverlap(start1, end1, start2, end2) {
    const s1 = this.toMinutes(start1);
    const e1 = this.toMinutes(end1);
    const s2 = this.toMinutes(start2);
    const e2 = this.toMinutes(end2);

    return s1 < e2 && s2 < e1;
  }

  static normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static nextDay(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

//   🏟 COURT AVAILABILITY
  static async checkCourtAvailability(courtId, date, startTime, endTime, excludeBookingId = null) {
    const bookingDate = this.normalizeDate(date);
    const nextDay = this.nextDay(bookingDate);

    const query = {
      court: courtId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ["confirmed", "pending"] },
    };

    if (excludeBookingId) query._id = { $ne: excludeBookingId };

    const bookings = await Booking.find(query).lean();

    const conflict = bookings.find(b =>
      this.timeSlotsOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    return {
      available: !conflict,
      conflictingBooking: conflict || null,
    };
  }

// 🧑‍🏫 COACH AVAILABILITY
  static async checkCoachAvailability(coachId, date, startTime, endTime, excludeBookingId = null) {
    if (!coachId) return { available: true, conflictingBooking: null };

    const bookingDate = this.normalizeDate(date);
    const nextDay = this.nextDay(bookingDate);

    const query = {
      "resources.coach": coachId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ["confirmed", "pending"] },
    };

    if (excludeBookingId) query._id = { $ne: excludeBookingId };

    const bookings = await Booking.find(query).lean();

    const conflict = bookings.find(b =>
      this.timeSlotsOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    return {
      available: !conflict,
      conflictingBooking: conflict || null,
    };
  }

  
// 🎒 EQUIPMENT AVAILABILITY
  static async checkEquipmentAvailability(requestedEquipment, inventory, date, startTime, endTime, excludeBookingId = null) {
    if (!Array.isArray(requestedEquipment) || requestedEquipment.length === 0) {
      return { available: true, unavailableItems: [] };
    }

    const bookingDate = this.normalizeDate(date);
    const nextDay = this.nextDay(bookingDate);
    const unavailable = [];

    // Fetch all equipment overlapped bookings ONCE (performance boost)
    const bookings = await Booking.find({
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ["confirmed", "pending"] },
      "resources.equipment": { $exists: true },
    }).lean();

    for (const req of requestedEquipment) {
      const item = inventory.find(e => e._id.toString() === req.equipmentId);
      if (!item) {
        unavailable.push({
          equipmentId: req.equipmentId,
          reason: "Equipment not found",
        });
        continue;
      }

      let bookedQuantity = 0;

      for (const booking of bookings) {
        if (!this.timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) continue;

        const found = booking.resources.equipment?.find(e =>
          e.item.toString() === req.equipmentId
        );

        if (found) bookedQuantity += found.quantity;
      }

      const availableQty = item.totalQuantity - bookedQuantity;

      if (req.quantity > availableQty) {
        unavailable.push({
          equipmentId: req.equipmentId,
          equipmentName: item.name,
          requested: req.quantity,
          available: availableQty,
          reason: "Insufficient quantity",
        });
      }
    }

    return {
      available: unavailable.length === 0,
      unavailableItems: unavailable,
    };
  }

//   🔀 UNIVERSAL AVAILABILITY CHECK
  static async checkAllAvailability(params) {
    const {
      courtId,
      coachId,
      equipment,
      equipmentInventory,
      date,
      startTime,
      endTime,
      excludeBookingId,
    } = params;

    const [court, coach, equipmentRes] = await Promise.all([
      this.checkCourtAvailability(courtId, date, startTime, endTime, excludeBookingId),
      this.checkCoachAvailability(coachId, date, startTime, endTime, excludeBookingId),
      this.checkEquipmentAvailability(equipment, equipmentInventory, date, startTime, endTime, excludeBookingId),
    ]);

    const allAvailable = court.available && coach.available && equipmentRes.available;

    const issues = [];
    if (!court.available) issues.push({ resource: "court", ...court });
    if (!coach.available) issues.push({ resource: "coach", ...coach });
    if (!equipmentRes.available)
      issues.push({ resource: "equipment", details: equipmentRes.unavailableItems });

    return {
      available: allAvailable,
      court,
      coach,
      equipment: equipmentRes,
      issues,
    };
  }

//   🕒 AVAILABLE SLOT GENERATOR
  static async getAvailableSlots(courtId, date, slotDuration = 60) {
    const operatingHours = { start: 6, end: 22 }; // 6 AM – 10 PM
    const bookingDate = this.normalizeDate(date);
    const nextDay = this.nextDay(bookingDate);

    const bookings = await Booking.find({
      court: courtId,
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ["confirmed", "pending"] },
    })
      .sort({ startTime: 1 })
      .lean();

    const slots = [];
    const step = slotDuration / 60; // hours

    for (let hour = operatingHours.start; hour < operatingHours.end; hour += step) {
      const h = Math.floor(hour);
      const m = Math.round((hour % 1) * 60);

      const start = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const endMinutes = this.toMinutes(start) + slotDuration;
      const end = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

      let available = true;
      for (const booking of bookings) {
        if (this.timeSlotsOverlap(start, end, booking.startTime, booking.endTime)) {
          available = false;
          break;
        }
      }

      slots.push({
        startTime: start,
        endTime: end,
        available,
      });
    }

    return slots;
  }
}

module.exports = AvailabilityChecker;
