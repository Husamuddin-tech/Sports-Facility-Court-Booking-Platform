import React from 'react';

const EquipmentTable = ({ equipment = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Equipment</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price/Hour</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {equipment.map((eq) => (
            <tr key={eq._id}>
              <td className="px-4 py-2">{eq.name}</td>
              <td className="px-4 py-2">${eq.pricePerHour?.toFixed(2) || '0.00'}</td>
              <td className="px-4 py-2">{eq.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
