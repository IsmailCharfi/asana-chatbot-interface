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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dropMessages());
    dispatch(clearHistory());
    dispatch(addResponseMessage(startMessage));
  }, [reset, dispatch, startMessage]);

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
