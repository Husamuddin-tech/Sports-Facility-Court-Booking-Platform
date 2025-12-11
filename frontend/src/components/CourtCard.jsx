const CourtCard = ({ court, selected, onSelect }) => {
  const isSelected = selected?._id === court._id;

  return (
    <div
      onClick={() => onSelect(court)}
      className={`cursor-pointer transform transition-all duration-300 
        rounded-lg border border-mutedCharcoal p-4 
        bg-frostWhite shadow-sm hover:shadow-lg hover:-translate-y-1
        ${isSelected ? 'ring-2 ring-graphite bg-softSand' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-graphite">{court.name}</h3>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
              court.type === 'indoor'
                ? 'bg-paleSteel text-graphite'
                : 'bg-softSand text-graphite'
            }`}
          >
            {court.type.charAt(0).toUpperCase() + court.type.slice(1)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-graphite">${court.basePrice}</p>
          <p className="text-xs text-mutedCharcoal">per hour</p>
        </div>
      </div>

      <p className="text-mutedCharcoal text-sm mt-3">{court.description}</p>

      {court.amenities && court.amenities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {court.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-softSand text-graphite text-xs rounded"
            >
              {amenity}
            </span>
          ))}
          {court.amenities.length > 3 && (
            <span className="px-2 py-1 bg-softSand text-graphite text-xs rounded">
              +{court.amenities.length - 3} more
            </span>
          )}
        </div>
      )}

      {!court.isActive && (
        <div className="mt-3 px-3 py-1 bg-red-100 text-red-600 text-sm rounded text-center">
          Currently Unavailable
        </div>
      )}
    </div>
  );
};

export default CourtCard;
