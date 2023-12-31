import { ElementType } from "react";

type BaseMessage = {
  id: string;
  type: string;
  component: ElementType;
  sender: string;
  showAvatar: boolean;
  timestamp: Date;
  unread: boolean;
  props?: any;
};

export interface MessageTypes extends BaseMessage {
  text: string;
}

export interface BehaviorState {
  showChat: boolean;
  disabledInput: boolean;
  messageLoader: boolean;
}

export interface MessageHistory {
  human: string;
  bot: string;
}

export interface MessagesState {
  history: MessageHistory[];
  messages: MessageTypes[];
  badgeCount: number;
  lastMessage: string;
}

export interface Config {
  apiPath: string | null;
  primaryColor: string;
  secondaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  badgeColor: string;
  badgeTextColor: string;
  fontFamily: string;
  headerText: string;
  headerIcon: string;
  avatar: string;
  backgroundImage: string;
  width: string;
  firstMessage: string;
  errorMessage: string;
  historyLimit: number;
  openIcon: string;
  closeIcon: string;
  showEmoji: boolean;
  showMic: boolean;
  showPreview: boolean;
  sendMessageApiCall:
    | ((
        prompt: string,
        history: MessageHistory[],
        messages: MessageTypes[],
        token: string | null
      ) => Promise<{ response: string, token: string }>)
    | null;
  onOpen: () => any;
  onClose: () => any;
  onOpenEmoji: () => any;
  onSendMessage: (message: string, history: MessageHistory[]) => any;
  onReceiveMessage: (message: string) => any;
  onWaiting: (clientMessage: string) => any;
}

export interface ConfigState {
  config: Config;
  initialWidth: string;
  token: string | null;
}
