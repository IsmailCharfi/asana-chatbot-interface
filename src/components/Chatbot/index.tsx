import cn from "classnames";
import Conversation from "./components/Conversation";
import Launcher from "./components/Launcher";
import "./style.scss";
import { useDispatch, useSelector } from "../../store";
import { CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import {
  addResponseMessage,
  clearHistory,
  dropMessages,
} from "../../store/slices/messages";

export default function AsanaChatbot() {
  const { showChat, reset, startMessage } = useSelector((state) => ({
    showChat: state.behavior.showChat,
    reset: state.behavior.reset,
    startMessage: state.config.startMessage,
  }));
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dropMessages());
    dispatch(clearHistory());
    dispatch(addResponseMessage(startMessage));
  }, [reset, dispatch, startMessage]);

  useEffect(() => {
    let root = document.documentElement;

    root.style.setProperty("--asana-chat-primary", config.primaryColor);
    root.style.setProperty("--asana-chat-secondary", config.secondaryColor);
    root.style.setProperty("--asana-chat-primaryTextColor", config.primaryTextColor);
    root.style.setProperty("--asana-chat-secondaryTextColor", config.secondaryTextColor);
    root.style.setProperty("--asana-chat-badgeColor", config.badgeColor);
    root.style.setProperty("--asana-chat-badgeTextColor", config.badgeTextColor);
    root.style.setProperty("--asana-chat-fontFamily", config.fontFamily);
  }, [config]);

  return (
    <div
      className={cn({
        "asana-chat-widget-container": true,
        "asana-chat-close-widget-container ": !showChat,
      })}
    >
      <CSSTransition
        in={showChat}
        timeout={300}
        classNames="asana-chat-conversation-container"
        unmountOnExit
      >
        <Conversation />
      </CSSTransition>
      <Launcher />
    </div>
  );
}
