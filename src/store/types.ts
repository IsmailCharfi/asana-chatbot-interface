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

export interface MessagesState {
  messages: MessageTypes[];
  badgeCount: number;
}