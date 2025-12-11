// import { format } from 'date-fns';

const TimeSlotGrid = ({ slots, selectedSlot, onSelectSlot, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {Array(16).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-mutedCharcoal/20 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-mutedCharcoal text-center py-8">
        Select a court and date to see available time slots
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      {slots.map((slot, index) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;
        const isUnavailable = !slot.available;

        return (
          <button
            key={index}
            onClick={() => !isUnavailable && onSelectSlot(slot)}
            disabled={isUnavailable}
            className={`py-3 px-2 text-sm font-medium rounded-lg transition-all duration-200 
              ${isUnavailable 
                ? 'bg-mutedCharcoal/10 text-mutedCharcoal cursor-not-allowed' 
                : isSelected
                  ? 'bg-primary-600 text-frostWhite shadow-lg ring-1 ring-primary-400'
                  : 'bg-frostWhite text-graphite border border-mutedCharcoal hover:bg-primary-50 hover:border-primary-300'}
            `}
          >
            {slot.startTime}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
