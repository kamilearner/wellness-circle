import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Footer } from '../components/Footer';
import { API_BASE_URL } from '../config';

interface Message {
  id: string;
  content: string;
  user_email: string;
  created_at: string;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
}

export default function SupportGroupDetail() {
  const [group, setGroup] = useState<SupportGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupAndMessages = async () => {
      try {
        const [groupResponse, messagesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/support-groups/${groupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${API_BASE_URL}/support-groups/${groupId}/messages`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!groupResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [groupData, messagesData] = await Promise.all([
          groupResponse.json(),
          messagesResponse.json()
        ]);

        setGroup(groupData);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load group data');
        navigate('/support-groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndMessages();
  }, [groupId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/support-groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newMessage.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading group details...</p>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/support-groups')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                  <p className="text-sm text-gray-600">{group.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Group Info */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <img 
              src={group.image_url} 
              alt={group.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="w-5 h-5" />
                <span>{messages.length} messages in this group</span>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">
                  No messages yet. Be the first to share your thoughts!
                </p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-grow">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {message.user_email}
                          </p>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Send
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}