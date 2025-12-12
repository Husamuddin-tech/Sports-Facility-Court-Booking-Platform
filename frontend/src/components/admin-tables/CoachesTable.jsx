import React from 'react';

const CoachesTable = ({ coaches = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Coaches</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Specialization</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coaches.map((coach) => (
            <tr key={coach._id}>
              <td className="px-4 py-2">{coach.name}</td>
              <td className="px-4 py-2">{coach.specialization || '-'}</td>
              <td className="px-4 py-2">{coach.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoachesTable;
