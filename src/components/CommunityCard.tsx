import React from 'react';
import { Users } from 'lucide-react';
import { Community } from '../types';

interface Props {
  community: Community;
}

export function CommunityCard({ community }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={community.imageUrl} 
        alt={community.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
        <p className="text-gray-600 mb-4">{community.description}</p>
        <div className="flex items-center justify-between">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {community.category}
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{community.members.toLocaleString()} members</span>
          </div>
        </div>
      </div>
    </div>
  );
}