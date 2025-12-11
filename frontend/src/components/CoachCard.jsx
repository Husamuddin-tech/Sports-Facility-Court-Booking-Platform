import { FiUser, FiStar, FiClock } from 'react-icons/fi';

const CoachCard = ({ coach, selected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(coach)}
      className={`cursor-pointer transform transition-all duration-300 
        rounded-lg border border-mutedCharcoal p-4 
        bg-frostWhite shadow-sm hover:shadow-lg hover:-translate-y-1
        ${
          selected?._id === coach._id
            ? 'ring-2 ring-graphite bg-softSand'
            : ''
        }`}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-paleSteel rounded-full flex items-center justify-center shrink-0">
          <FiUser className="w-8 h-8 text-graphite" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-graphite truncate">{coach.name}</h3>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-graphite">${coach.hourlyRate}</p>
              <p className="text-xs text-mutedCharcoal">per hour</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-2 text-sm text-mutedCharcoal">
            <span className="flex items-center">
              <FiStar className="w-4 h-4 mr-1 text-graphite" />
              {coach.specialization}
            </span>
            <span className="flex items-center">
              <FiClock className="w-4 h-4 mr-1 text-graphite" />
              {coach.experience} yrs
            </span>
          </div>

          {coach.bio && (
            <p className="text-sm text-mutedCharcoal mt-2 line-clamp-2">{coach.bio}</p>
          )}
        </div>
      </div>

      {selected?._id === coach._id && (
        <div className="mt-3 flex items-center justify-center text-sm font-medium text-graphite">
          ✓ Selected
        </div>
      )}
    </div>
  );
};

export default CoachCard;
