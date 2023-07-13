import { ElementType } from "react";

type BaseMessage = {
  type: string;
  component: ElementType;
  sender: string;
  showAvatar: boolean;
  timestamp: Date;
  unread: boolean;
  customId?: string;
  props?: any;
};

export interface MessageTypes extends BaseMessage {
  text: string;
}

export interface BehaviorState {
  showChat: boolean;
  disabledInput: boolean;
  messageLoader: boolean;
  reset: boolean;
}

export interface MessageHistory {
  client: string;
  bot: string;
}

export interface MessagesState {
  history: MessageHistory[];
  messages: MessageTypes[];
  badgeCount: number;
}

export interface ConfigState {
  apiPath: string | null;
  primaryColor: string;
  secondaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  badgeColor: string;
  badgeTextColor: string;
  fontFamily: string;
  botName: string;
  botIcon: string;
  backgroundImage: string;
  width: string;
  startMessage: string;
  errorMessage: string;
  openLauncherIcon: string;
  closeLauncherIcon: string;
  closeIcon: string;
  resetIcon: string;
  confirmText: string;
  showConfirm: boolean;
  showEmoji: boolean;
  showReset: boolean;
  sendMessageApiCall:
    | ((
        prompt: string,
        history: MessageHistory[],
        messages: MessageTypes[]
      ) => Promise<{ text: string }>)
    | null;
  onLauncherOpen: () => any;
  onLauncherClose: () => any;
  onReset: () => any;
  afterReset: () => any;
  onOpenEmoji: () => any;
  onSendMessage: (message: string, history: MessageHistory[]) => any;
  onReceiveMessage: (message: string) => any;
  onWaiting: (clientMessage: string) => any;
}
