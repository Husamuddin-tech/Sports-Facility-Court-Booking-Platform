import React from 'react';

const PricingTable = ({ pricingList = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Pricing Breakdown</h2>
      {pricingList.length === 0 ? (
        <p className="text-gray-500">No pricing data available</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Booking</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Court Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Coach Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Equipment Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pricingList.map((p, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{p.bookingName || `Booking #${index + 1}`}</td>
                <td className="px-4 py-2">${p.courtPrice?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-2">${p.coachPrice?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-2">${p.equipmentPrice?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-2 font-medium">${p.total?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PricingTable;
