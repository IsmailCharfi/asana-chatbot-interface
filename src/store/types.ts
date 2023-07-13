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
  apiPath: string;
  primaryColor: string;
  secondaryColor: string;
  primaryTextColor: string;
  secondatyTextColor: string;
  botName: string;
  botIcon: string;
  startMessage: string;
  errorMessage: string;
}
