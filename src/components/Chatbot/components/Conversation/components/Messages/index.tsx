import { useEffect, useRef } from "react";
import { MessageTypes } from "../../../../../../store/types";
import { MESSAGE_SENDER } from "../../../../../../constants";
import Loader from "./components/Loader";
import "./styles.scss";
import { scrollToBottom } from "../../../../../../utils/messages";
import logo from "../Header/assets/robot.png";
import { useDispatch, useSelector } from "../../../../../../store";
import {
  markAllMessagesRead,
  setBadgeCount,
} from "../../../../../../store/slices/messages";
import { CSSTransition } from "react-transition-group";

function Messages() {
  const dispatch = useDispatch();
  const { messages, typing, showChat, badgeCount } = useSelector((state) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat,
  }));

  const messageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollToBottom(messageRef.current);
    if (showChat && badgeCount) {
      dispatch(markAllMessagesRead());
    } else
      dispatch(
        setBadgeCount(messages.filter((message) => message.unread).length)
      );
  }, [messages, badgeCount, showChat, dispatch]);

  const getComponentToRender = (message: MessageTypes) => {
    const ComponentToRender = message.component;
    return <ComponentToRender message={message} />;
  };

  const isClient = (sender: any) => sender === MESSAGE_SENDER.CLIENT;

  return (
    <div
      id="messages"
      className="asana-chat-messages-container"
      ref={messageRef}
    >
      {messages?.map((message, index) => (
        <div
          className={`asana-chat-message ${
            isClient(message.sender) ? "asana-chat-message-client" : ""
          }`}
          key={index}
        >
          {!isClient(message.sender) && message.showAvatar && (
            <img src={logo} className={"asana-chat-avatar"} alt="profile" />
          )}
          {getComponentToRender(message)}
        </div>
      ))}
      <CSSTransition in={typing} timeout={300} classNames="asana-chat-message">
        {typing ? <Loader /> : <></>}
      </CSSTransition>
    </div>
  );
}

export default Messages;
