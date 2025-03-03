import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="ml-5">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;