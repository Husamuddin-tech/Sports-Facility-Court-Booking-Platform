import React from 'react';
import { format } from 'date-fns';

const BookingsTable = ({ bookings = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Bookings</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Court</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((b) => (
            <tr key={b._id}>
              <td className="px-4 py-2">{b.user?.name || '-'}</td>
              <td className="px-4 py-2">{b.court?.name || '-'}</td>
              <td className="px-4 py-2">{b.date ? format(new Date(b.date), 'yyyy-MM-dd') : '-'}</td>
              <td className="px-4 py-2">{b.startTime} - {b.endTime}</td>
              <td className="px-4 py-2">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
