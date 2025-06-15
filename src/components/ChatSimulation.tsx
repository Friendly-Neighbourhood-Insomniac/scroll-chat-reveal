
import React from 'react';
import { useChatSimulation, ChatMessage as ChatMessageType, ChatSimulationConfig } from '../hooks/useChatSimulation';
import ChatMessage, { ChatMessageTheme } from './ChatMessage';

export interface ChatSimulationProps extends ChatSimulationConfig {
  theme?: ChatSimulationTheme;
  showHeader?: boolean;
  showProgress?: boolean;
  showCompletionMessage?: boolean;
  headerConfig?: HeaderConfig;
  className?: string;
}

export interface ChatSimulationTheme {
  backgroundColor?: string;
  headerBackgroundColor?: string;
  progressBackgroundColor?: string;
  completionBackgroundColor?: string;
  messageTheme?: ChatMessageTheme;
}

export interface HeaderConfig {
  name?: string;
  avatar?: string;
  status?: string;
  statusColor?: string;
}

const defaultMessages: ChatMessageType[] = [
  { sender: 'Perci', message: 'Yawn...' },
  { sender: 'You', message: '...fr bro these meetings are so boring..' },
  { sender: 'typing', message: '' },
  { sender: 'Perci', message: 'Watching Cassandra "kick-flip" another PowerPoint... greaaaaaat, don\'t hurt yourself boomer -.- But hold up fam, I got an idea.' },
  { sender: 'You', message: 'LOL... dude you can\'t fart in a meeting again. HR will flip.' },
  { sender: 'typing', message: '' },
  { sender: 'Perci', message: '...tempting, but nah. What if I told you you could play through this meeting on EZ mode?' },
  { sender: 'You', message: 'No cap?!' },
  { sender: 'typing', message: '' },
  { sender: 'Perci', message: 'Cap?' },
  { sender: 'Perci', message: 'I don\'t even wear hats dude...' },
  { sender: 'Perci', message: 'Look: [Video link]' },
  { sender: 'You', message: 'Hold up...this slaps!' },
  { sender: 'typing', message: '' },
  { sender: 'Perci', message: 'I know right! No more watching Cassandra \'slay dem powerpoints\'...pfff do a kickflip boomer -.-' },
  { sender: 'Perci', message: 'But don\'t just take my word for it, check it out for yourself :[Game link]' }
];

const defaultTheme: ChatSimulationTheme = {
  backgroundColor: 'bg-gradient-to-b from-gray-100 to-gray-200',
  headerBackgroundColor: 'bg-white border-b border-gray-200',
  progressBackgroundColor: 'bg-blue-50',
  completionBackgroundColor: 'bg-green-50'
};

const defaultHeaderConfig: HeaderConfig = {
  name: 'Perci',
  avatar: 'P',
  status: 'Online',
  statusColor: 'text-green-500'
};

const ChatSimulation: React.FC<ChatSimulationProps> = ({
  messages = defaultMessages,
  theme = defaultTheme,
  showHeader = true,
  showProgress = true,
  showCompletionMessage = true,
  headerConfig = defaultHeaderConfig,
  className = '',
  ...config
}) => {
  const currentTheme = { ...defaultTheme, ...theme };
  const currentHeaderConfig = { ...defaultHeaderConfig, ...headerConfig };
  
  const { state, handlers } = useChatSimulation({ messages, ...config });

  return (
    <div 
      ref={handlers.containerRef}
      className={`fixed inset-0 ${currentTheme.backgroundColor} overflow-hidden ${className}`}
    >
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        {showHeader && (
          <div className={`${currentTheme.headerBackgroundColor} p-4 shadow-sm flex-shrink-0`}>
            <div className="flex items-center space-x-3 max-w-2xl mx-auto">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentHeaderConfig.avatar}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{currentHeaderConfig.name}</div>
                <div className={`text-sm ${currentHeaderConfig.statusColor}`}>● {currentHeaderConfig.status}</div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-white max-w-2xl mx-auto p-6 overflow-y-auto">
            {state.visibleMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isVisible={true}
                theme={currentTheme.messageTheme}
              />
            ))}
            
            {/* Show current typing indicator only if it's the current message */}
            {state.showTypingIndicator && (
              <ChatMessage
                sender="typing"
                message=""
                isVisible={true}
                isTyping={true}
                theme={currentTheme.messageTheme}
              />
            )}
            
            {/* Invisible div to help with scrolling */}
            <div ref={handlers.messagesEndRef} />
          </div>
        </div>

        {/* Scroll instruction */}
        {!state.isComplete && showProgress && (
          <div className={`${currentTheme.progressBackgroundColor} p-4 flex-shrink-0`}>
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-blue-600 font-medium">Scroll down to continue the conversation...</div>
              <div className="text-sm text-blue-500 mt-1">
                Message {Math.min(state.currentMessageIndex + 1, messages.length)} of {messages.length}
              </div>
            </div>
          </div>
        )}

        {/* End message */}
        {state.isComplete && showCompletionMessage && (
          <div className={`${currentTheme.completionBackgroundColor} p-6 flex-shrink-0`}>
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
