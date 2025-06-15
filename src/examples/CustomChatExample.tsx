
import React from 'react';
import ChatSimulation from '../components/ChatSimulation';
import { ChatMessage } from '../hooks/useChatSimulation';

// Example of how to use the ChatSimulation component with custom configuration
const CustomChatExample: React.FC = () => {
  const customMessages: ChatMessage[] = [
    { sender: 'Alice', message: 'Hey there! How are you doing?' },
    { sender: 'You', message: 'I\'m doing great! Thanks for asking.' },
    { sender: 'typing', message: '' },
    { sender: 'Alice', message: 'That\'s wonderful to hear!' },
    { sender: 'You', message: 'How about you? How has your day been?' },
    { sender: 'typing', message: '' },
    { sender: 'Alice', message: 'It\'s been pretty good, thanks for asking!' }
  ];

  return (
    <ChatSimulation
      messages={customMessages}
      typingDelay={2000}
      messageDelay={800}
      scrollDelay={1200}
      theme={{
        backgroundColor: 'bg-gradient-to-b from-purple-100 to-pink-100',
        headerBackgroundColor: 'bg-purple-600 text-white',
        progressBackgroundColor: 'bg-purple-50',
        completionBackgroundColor: 'bg-pink-50',
        messageTheme: {
          userBubbleColor: 'bg-purple-500',
          otherBubbleColor: 'bg-pink-200',
          userTextColor: 'text-white',
          otherTextColor: 'text-purple-800',
          typingDotColor: 'bg-purple-600'
        }
      }}
      headerConfig={{
        name: 'Alice',
        avatar: 'A',
        status: 'Active',
        statusColor: 'text-green-400'
      }}
      showHeader={true}
      showProgress={true}
      showCompletionMessage={true}
    />
  );
};

export default CustomChatExample;
