
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatSimulation: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const messages = [
    { sender: 'Perci' as const, message: 'Yawn...' },
    { sender: 'You' as const, message: '...fr bro these meetings are so boring..' },
    { sender: 'typing' as const, message: '' },
    { sender: 'Perci' as const, message: 'Watching Cassandra "kick-flip" another PowerPoint... greaaaaaat, don\'t hurt yourself boomer -.- But hold up fam, I got an idea.' },
    { sender: 'You' as const, message: 'LOL... dude you can\'t fart in a meeting again. HR will flip.' },
    { sender: 'typing' as const, message: '' },
    { sender: 'Perci' as const, message: '...tempting, but nah. What if I told you you could play through this meeting on EZ mode?' },
    { sender: 'You' as const, message: 'No cap?!' },
    { sender: 'typing' as const, message: '' },
    { sender: 'Perci' as const, message: 'Cap?' },
    { sender: 'Perci' as const, message: 'I don\'t even wear hats dude...' },
    { sender: 'Perci' as const, message: 'Look: [Video link]' },
    { sender: 'You' as const, message: 'Hold up...this slaps!' },
    { sender: 'typing' as const, message: '' },
    { sender: 'Perci' as const, message: 'I know right! No more watching Cassandra \'slay dem powerpoints\'...pfff do a kickflip boomer -.-' },
    { sender: 'Perci' as const, message: 'But don\'t just take my word for it, check it out for yourself :[Game link]' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      const currentScrollY = window.scrollY;
      
      // Check if scrolling down and haven't reached the end
      if (currentScrollY > lastScrollY.current && currentMessageIndex < messages.length) {
        setIsScrolling(true);
        
        // If current message is typing, show it briefly then advance
        if (messages[currentMessageIndex]?.sender === 'typing') {
          setTimeout(() => {
            setCurrentMessageIndex(prev => Math.min(prev + 2, messages.length)); // Skip typing and show next message
            setIsScrolling(false);
          }, 1000);
        } else {
          setCurrentMessageIndex(prev => Math.min(prev + 1, messages.length));
          setIsScrolling(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentMessageIndex, isScrolling, messages.length]);

  const visibleMessages = messages.slice(0, currentMessageIndex);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div ref={containerRef} className="max-w-2xl mx-auto p-6">
        {/* Chat Header */}
        <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 mb-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              P
            </div>
            <div>
              <div className="font-semibold text-gray-800">Perci</div>
              <div className="text-sm text-green-500">● Online</div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-b-lg p-6 shadow-lg min-h-96">
          {visibleMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              sender={msg.sender}
              message={msg.message}
              isVisible={true}
            />
          ))}
          
          {/* Show current typing indicator if it's a typing message */}
          {currentMessageIndex < messages.length && messages[currentMessageIndex]?.sender === 'typing' && (
            <ChatMessage
              sender="typing"
              message=""
              isVisible={true}
              isTyping={true}
            />
          )}
        </div>

        {/* Scroll instruction */}
        {currentMessageIndex < messages.length && (
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-medium">Scroll down to continue the conversation...</div>
            <div className="text-sm text-blue-500 mt-1">
              Message {Math.min(currentMessageIndex + 1, messages.length)} of {messages.length}
            </div>
          </div>
        )}

        {/* End message */}
        {currentMessageIndex >= messages.length && (
          <div className="text-center mt-8 p-6 bg-green-50 rounded-lg">
            <div className="text-green-600 font-medium text-lg">🎉 Conversation Complete!</div>
            <div className="text-sm text-green-500 mt-2">
              Refresh the page to experience it again
            </div>
          </div>
        )}

        {/* Spacer to enable more scrolling */}
        <div className="h-screen"></div>
      </div>
    </div>
  );
};

export default ChatSimulation;
