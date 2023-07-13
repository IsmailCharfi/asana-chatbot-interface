import cn from "classnames";
import Conversation from "./components/Conversation";
import Launcher from "./components/Launcher";
import "./style.scss";
import { useDispatch, useSelector } from "../../store";
import { CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import { addResponseMessage, dropMessages } from "../../store/slices/messages";

export default function AsanaChatbot() {
  const { showChat, reset } = useSelector((state) => state.behavior);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dropMessages());
    dispatch(
      addResponseMessage(
        "Bonjour! je suis votre assistant Asana n'hésitez pas à me poser des questions!"
      )
    );
  }, [reset, dispatch]);

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
