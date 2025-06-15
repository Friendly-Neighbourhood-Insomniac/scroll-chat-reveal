
import React from 'react';

export interface ChatMessageProps {
  sender: 'typing' | string;
  message: string;
  isVisible: boolean;
  isTyping?: boolean;
  theme?: ChatMessageTheme;
}

export interface ChatMessageTheme {
  userBubbleColor?: string;
  otherBubbleColor?: string;
  userTextColor?: string;
  otherTextColor?: string;
  typingDotColor?: string;
}

const defaultTheme: ChatMessageTheme = {
  userBubbleColor: 'bg-blue-500',
  otherBubbleColor: 'bg-gray-200',
  userTextColor: 'text-white',
  otherTextColor: 'text-gray-800',
  typingDotColor: 'bg-gray-600'
};

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  sender, 
  message, 
  isVisible, 
  isTyping = false,
  theme = defaultTheme 
}) => {
  const currentTheme = { ...defaultTheme, ...theme };

  if (sender === 'typing') {
    return (
      <div className={`flex justify-start mb-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gray-300 rounded-lg px-4 py-2 max-w-xs">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 ${currentTheme.typingDotColor} rounded-full animate-bounce`}></div>
            <div className={`w-2 h-2 ${currentTheme.typingDotColor} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-2 h-2 ${currentTheme.typingDotColor} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const isYou = sender === 'You';
  
  return (
    <div className={`flex ${isYou ? 'justify-end' : 'justify-start'} mb-4 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isYou 
          ? `${currentTheme.userBubbleColor} ${currentTheme.userTextColor} rounded-br-none` 
          : `${currentTheme.otherBubbleColor} ${currentTheme.otherTextColor} rounded-bl-none`
      }`}>
        <div className="text-xs font-semibold mb-1 opacity-70">{sender}</div>
        <div className="whitespace-pre-wrap">{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
