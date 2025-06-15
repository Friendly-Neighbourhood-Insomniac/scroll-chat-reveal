
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

export interface ChatMessageTheme {
  userBubbleColor?: string;
  otherBubbleColor?: string;
  userTextColor?: string;
  otherTextColor?: string;
  typingDotColor?: string;
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
