
import { useState, useEffect, useRef } from 'react';

export interface ChatMessage {
  sender: 'typing' | string;
  message: string;
}

export interface ChatSimulationConfig {
  messages: ChatMessage[];
  typingDelay?: number;
  scrollDelay?: number;
  messageDelay?: number;
}

export interface ChatSimulationState {
  currentMessageIndex: number;
  isScrolling: boolean;
  isComplete: boolean;
  visibleMessages: ChatMessage[];
  showTypingIndicator: boolean;
}

export interface ChatSimulationHandlers {
  containerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const useChatSimulation = (config: ChatSimulationConfig) => {
  const {
    messages,
    typingDelay = 1500,
    scrollDelay = 1000,
    messageDelay = 500
  } = config;

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            setTimeout(() => setIsScrolling(false), scrollDelay);
          }, typingDelay);
        } else {
          setTimeout(() => {
            setCurrentMessageIndex(prev => Math.min(prev + 1, messages.length));
            setTimeout(() => setIsScrolling(false), scrollDelay);
          }, messageDelay);
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
  }, [currentMessageIndex, isScrolling, messages.length, typingDelay, scrollDelay, messageDelay]);

  // Filter out typing messages that should be replaced by actual messages
  const visibleMessages = messages.slice(0, currentMessageIndex).filter((msg, index) => {
    // If this is a typing message and the next message exists and is not typing, hide this typing message
    if (msg.sender === 'typing' && index < currentMessageIndex - 1) {
      return false;
    }
    return true;
  });

  const showTypingIndicator = currentMessageIndex < messages.length && 
    messages[currentMessageIndex]?.sender === 'typing';

  const isComplete = currentMessageIndex >= messages.length;

  const state: ChatSimulationState = {
    currentMessageIndex,
    isScrolling,
    isComplete,
    visibleMessages,
    showTypingIndicator
  };

  const handlers: ChatSimulationHandlers = {
    containerRef,
    messagesEndRef
  };

  return { state, handlers };
};
