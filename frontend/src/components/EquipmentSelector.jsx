import { FiMinus, FiPlus } from 'react-icons/fi';

const EquipmentSelector = ({ equipment, selectedEquipment, onUpdateQuantity }) => {
  const getQuantity = (equipmentId) => {
    const item = selectedEquipment.find((e) => e.equipmentId === equipmentId);
    return item?.quantity || 0;
  };

  const handleUpdate = (item, delta) => {
    const currentQty = getQuantity(item._id);
    const newQty = Math.max(0, Math.min(currentQty + delta, item.totalQuantity));
    onUpdateQuantity(item._id, newQty);
  };

  return (
    <div className="space-y-3">
      {equipment.map((item) => {
        const quantity = getQuantity(item._id);
        const isSelected = quantity > 0;

        return (
          <div
            key={item._id}
            className={`p-4 rounded-lg border transition-all duration-200
              ${isSelected ? 'border-graphite bg-softSand shadow-sm' : 'border-mutedCharcoal bg-frostWhite hover:shadow'} 
              cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-graphite text-lg">{item.name}</h4>
                <p className="text-sm text-mutedCharcoal mt-1">{item.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="font-medium text-graphite">${item.pricePerHour}/hr</span>
                  <span className="text-xs text-mutedCharcoal">{item.totalQuantity} available</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdate(item, -1)}
                  disabled={quantity === 0}
                  className="w-8 h-8 rounded-full bg-frostWhite border border-mutedCharcoal flex items-center justify-center 
                    hover:bg-softSand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiMinus className="w-4 h-4 text-graphite" />
                </button>
                <span className="w-8 text-center font-semibold text-graphite">{quantity}</span>
                <button
                  onClick={() => handleUpdate(item, 1)}
                  disabled={quantity >= item.totalQuantity}
                  className="w-8 h-8 rounded-full bg-softSand text-graphite flex items-center justify-center 
                    hover:bg-paleSteel disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentSelector;
