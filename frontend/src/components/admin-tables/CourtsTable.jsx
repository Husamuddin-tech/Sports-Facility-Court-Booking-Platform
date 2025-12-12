import React from 'react';

const CourtsTable = ({ courts = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Courts</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {courts.map((court) => (
            <tr key={court._id}>
              <td className="px-4 py-2">{court.name}</td>
              <td className="px-4 py-2">{court.type}</td>
              <td className="px-4 py-2">{court.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourtsTable;
