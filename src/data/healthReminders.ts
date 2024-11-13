import { HealthReminder } from '../types';

export const healthReminders: HealthReminder[] = [
  {
    id: '1',
    title: 'Mammogram',
    description: 'Regular breast cancer screening',
    frequency: 'Every 1-2 years',
    startAge: 40
  },
  {
    id: '2',
    title: 'Pap Smear',
    description: 'Cervical cancer screening',
    frequency: 'Every 3 years',
    startAge: 21
  },
  {
    id: '3',
    title: 'Bone Density',
    description: 'Osteoporosis screening',
    frequency: 'Every 2 years',
    startAge: 65
  },
  {
    id: '4',
    title: 'Blood Pressure',
    description: 'Hypertension screening',
    frequency: 'Yearly',
    startAge: 18
  }
];