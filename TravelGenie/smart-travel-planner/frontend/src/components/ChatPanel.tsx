import React, { useState } from 'react';
import axios from 'axios';
import styles from './ChatPanel.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  onItineraryGenerated: (itinerary: any) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onItineraryGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/generate-itinerary', {
        message: input
      });

      if (response.data && response.data.daily_plan) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: "I've generated a travel itinerary for you!"
        };
        setMessages(prev => [...prev, assistantMessage]);
        onItineraryGenerated(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      const errorMessage: Message = {
        role: 'assistant', 
        content: 'Sorry, there was an error generating your itinerary. Please try again with a different request.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHistory}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.role]}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.assistant}`}>Generating itinerary...</div>}
      </div>
      <form onSubmit={handleSubmit} className={styles.chatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your travel request (e.g., 'Plan a 4 day trip to Rome with a budget of $600')"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel; 