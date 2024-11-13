import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Calendar as CalendarIcon, Bell } from 'lucide-react';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';
import { Footer } from '../components/Footer';
import 'react-calendar/dist/Calendar.css';
import { API_BASE_URL } from '../config';

interface PeriodEntry {
  date: string;
  notes: string;
}

interface HealthReminder {
  name: string;
  frequency: string;
  nextDate: string;
}

function PeriodTracker() {
  const [periodDates, setPeriodDates] = useState<PeriodEntry[]>([]);
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    name: '',
    frequency: '',
    nextDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeriodDates();
    fetchReminders();
  }, []);

  // Update notes when a date is selected
  useEffect(() => {
    const selectedEntry = periodDates.find(
      entry => new Date(entry.date).toDateString() === selectedDate.toDateString()
    );
    setNotes(selectedEntry?.notes || '');
  }, [selectedDate, periodDates]);

  const fetchPeriodDates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/periods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPeriodDates(data);
    } catch (error) {
      toast.error('Failed to fetch period dates');
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/periods/reminders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      toast.error('Failed to fetch reminders');
    }
  };

  const handleDateClick = async () => {
    try {
      await fetch(`${API_BASE_URL}/periods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0], // Store only the date part
          notes
        })
      });
      
      toast.success('Period date updated successfully');
      fetchPeriodDates();
    } catch (error) {
      toast.error('Failed to update period date');
    }
  };

  const handleAddReminder = async () => {
    try {
      await fetch(`${API_BASE_URL}/periods/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReminder)
      });
      
      toast.success('Reminder added successfully');
      fetchReminders();
      setShowAddReminder(false);
      setNewReminder({ name: '', frequency: '', nextDate: '' });
    } catch (error) {
      toast.error('Failed to add reminder');
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const isPeriodDate = periodDates.some(
      entry => new Date(entry.date).toDateString() === date.toDateString()
    );
    return isPeriodDate ? 'bg-purple-200 rounded-full' : '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Period Tracker</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Period Calendar</h2>
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                className="w-full border-none"
              />
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes for {selectedDate.toLocaleDateString()}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this date..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={handleDateClick}
                  className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {periodDates.some(entry => new Date(entry.date).toDateString() === selectedDate.toDateString())
                    ? 'Update Period Date'
                    : 'Mark Period Date'
                  }
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Health Reminders</h2>
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              
              {reminders.map((reminder, index) => (
                <div key={index} className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold">{reminder.name}</h3>
                  <p className="text-sm text-gray-600">Frequency: {reminder.frequency}</p>
                  <p className="text-sm text-gray-600">
                    Next Date: {new Date(reminder.next_date).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {showAddReminder ? (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Reminder name"
                    value={newReminder.name}
                    onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Every 3 months)"
                    value={newReminder.frequency}
                    onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={newReminder.nextDate}
                    onChange={(e) => setNewReminder({ ...newReminder, nextDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddReminder}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save Reminder
                    </button>
                    <button
                      onClick={() => setShowAddReminder(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add New Reminder
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PeriodTracker;