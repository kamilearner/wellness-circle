import React from 'react';
import { Bell } from 'lucide-react';
import { HealthReminder } from '../types';

interface Props {
  reminder: HealthReminder;
  userAge: number;
}

export function ReminderCard({ reminder, userAge }: Props) {
  const isRelevant = userAge >= reminder.startAge;
  
  return (
    <div className={`p-6 rounded-lg shadow-md ${isRelevant ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-3">
        <Bell className={`w-6 h-6 ${isRelevant ? 'text-purple-600' : 'text-gray-400'}`} />
        <h3 className="text-lg font-semibold">{reminder.title}</h3>
      </div>
      <p className="text-gray-600 mb-2">{reminder.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-purple-600 font-medium">
          Frequency: {reminder.frequency}
        </span>
        <span className="text-gray-500">
          Recommended age: {reminder.startAge}+
        </span>
      </div>
    </div>
  );
}