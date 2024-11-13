import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Footer } from '../components/Footer';
import { API_BASE_URL } from '../config';

interface Message {
  _id: string;
  userId: {
    email: string;
  };
  content: string;
  createdAt: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

export default function GroupChat() {
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    const fetchGroupAndMessages = async () => {
      try {
        const [groupResponse, messagesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/support-groups/${groupId}`),
          fetch(`${API_BASE_URL}/support-groups/${groupId}/messages`)
        ]);

        const [groupData, messagesData] = await Promise.all([
          groupResponse.json(),
          messagesResponse.json()
        ]);

        if (!groupResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to fetch group data');
        }

        setGroup(groupData);
        setMessages(messagesData);
      } catch (error) {
        toast.error('Failed to load group chat');
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
        body: JSON.stringify({ content: newMessage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading group chat...</div>;
  }

  if (!group) {
    return null;
  }

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div key={message._id} className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-grow">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {message.userId.email}
                        </p>
                        <p className="text-gray-700">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

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
}</content>
