
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatSimulation: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to center the newest message
  useEffect(() => {
    if (messagesEndRef.current && currentMessageIndex > 0) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentMessageIndex]);

  // Prevent external scrolling until chat is complete
  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentMessageIndex, messages.length]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling || currentMessageIndex >= messages.length) return;
      
      e.preventDefault();
      
      // Check if scrolling down
      if (e.deltaY > 0) {
        setIsScrolling(true);
        
        // If current message is typing, show it briefly then advance
        if (messages[currentMessageIndex]?.sender === 'typing') {
          setTimeout(() => {
            setCurrentMessageIndex(prev => Math.min(prev + 2, messages.length)); // Skip typing and show next message
            setTimeout(() => setIsScrolling(false), 1000);
          }, 1500); // Show typing longer
        } else {
          setTimeout(() => {
            setCurrentMessageIndex(prev => Math.min(prev + 1, messages.length));
            setTimeout(() => setIsScrolling(false), 1000);
          }, 500);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, [currentMessageIndex, isScrolling, messages.length]);

  // Filter out typing messages that should be replaced by actual messages
  const visibleMessages = messages.slice(0, currentMessageIndex).filter((msg, index) => {
    // If this is a typing message and the next message exists and is not typing, hide this typing message
    if (msg.sender === 'typing' && index < currentMessageIndex - 1) {
      return false;
    }
    return true;
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-3 max-w-2xl mx-auto">
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
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-white max-w-2xl mx-auto p-6 overflow-y-auto">
            {visibleMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isVisible={true}
              />
            ))}
            
            {/* Show current typing indicator only if it's the current message */}
            {currentMessageIndex < messages.length && messages[currentMessageIndex]?.sender === 'typing' && (
              <ChatMessage
                sender="typing"
                message=""
                isVisible={true}
                isTyping={true}
              />
            )}
            
            {/* Invisible div to help with scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll instruction */}
        {currentMessageIndex < messages.length && (
          <div className="bg-blue-50 p-4 flex-shrink-0">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-blue-600 font-medium">Scroll down to continue the conversation...</div>
              <div className="text-sm text-blue-500 mt-1">
                Message {Math.min(currentMessageIndex + 1, messages.length)} of {messages.length}
              </div>
            </div>
          </div>
        )}

        {/* End message */}
        {currentMessageIndex >= messages.length && (
          <div className="bg-green-50 p-6 flex-shrink-0">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-green-600 font-medium text-lg">🎉 Conversation Complete!</div>
              <div className="text-sm text-green-500 mt-2">
                You can now scroll normally or refresh to experience it again
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSimulation;
