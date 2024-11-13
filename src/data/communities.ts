import { Community } from '../types';

export const communities: Community[] = [
  {
    id: '1',
    name: 'Breast Cancer Warriors',
    description: 'Support group for breast cancer patients and survivors',
    members: 1243,
    category: 'Cancer Support',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514'
  },
  {
    id: '2',
    name: 'PCOS Sisters',
    description: 'Discussion and support for women with PCOS',
    members: 856,
    category: 'Hormonal Health',
    imageUrl: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5'
  },
  {
    id: '3',
    name: 'Endometriosis Support',
    description: 'Share experiences and find support for endometriosis',
    members: 677,
    category: 'Chronic Conditions',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b'
  }
];