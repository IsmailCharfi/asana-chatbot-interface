import Message from "../components/Chatbot/components/Conversation/components/Messages/components/Message";
import {
  MESSAGES_TYPES,
  MESSAGE_SENDER,
  MESSAGE_BOX_SCROLL_DURATION,
} from "../constants";
import { MessageTypes as MessageI } from "../store/types";

export function createNewMessage(
  text: string,
  sender: string,
  id?: string
): MessageI {
  return {
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    timestamp: new Date(),
    showAvatar: true,
    customId: id,
    unread: sender === MESSAGE_SENDER.RESPONSE,
  };
}

function sinEaseOut(timestamp: any, begining: any, change: any, duration: any) {
  return (
    change *
      ((timestamp = timestamp / duration - 1) * timestamp * timestamp + 1) +
    begining
  );
}

/**
 *
 * @param {*} target scroll target
 * @param {*} scrollStart
 * @param {*} scroll scroll distance
 */
function scrollWithSlowMotion(target: any, scrollStart: any, scroll: number) {
  const raf = window?.requestAnimationFrame;
  let start = 0;
  const step = (timestamp: any) => {
    if (!start) {
      start = timestamp;
    }
    let stepScroll = sinEaseOut(
      timestamp - start,
      0,
      scroll,
      MESSAGE_BOX_SCROLL_DURATION
    );
    let total = scrollStart + stepScroll;
    target.scrollTop = total;
    if (total < scrollStart + scroll) {
      raf(step);
    }
  };
  raf(step);
}

export function scrollToBottom(messagesDiv: HTMLDivElement | null) {
  if (!messagesDiv) return;
  const screenHeight = messagesDiv.clientHeight;
  const scrollTop = messagesDiv.scrollTop;
  const scrollOffset = messagesDiv.scrollHeight - (scrollTop + screenHeight);
  if (scrollOffset) scrollWithSlowMotion(messagesDiv, scrollTop, scrollOffset);
}
