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
  setLastMessage,
} from "../../store/slices/messages";
import { Config } from "../../store/types";
import { setConfig } from "../../store/slices/config";
import { Helmet } from "react-helmet-async";

type AsanaChatbotProps = {
  config: Partial<Config>;
};

export default function AsanaChatbot(props: AsanaChatbotProps) {
  const { showChat, firstMessage, config } = useSelector((state) => ({
    showChat: state.behavior.showChat,
    firstMessage: state.config.config.firstMessage,
    config: state.config.config,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dropMessages());
    dispatch(clearHistory());
    dispatch(addResponseMessage(firstMessage, false));
    dispatch(setLastMessage(firstMessage));
  }, [dispatch, firstMessage]);

  useEffect(() => {
    dispatch(setConfig(props.config));
  }, [props.config]);

  useEffect(() => {
    let root = document.documentElement;

    root.style.setProperty("--asana-chat-primary", config.primaryColor);
    root.style.setProperty("--asana-chat-secondary", config.secondaryColor);
    root.style.setProperty(
      "--asana-chat-primaryTextColor",
      config.primaryTextColor
    );
    root.style.setProperty(
      "--asana-chat-secondaryTextColor",
      config.secondaryTextColor
    );
    root.style.setProperty("--asana-chat-badgeColor", config.badgeColor);
    root.style.setProperty(
      "--asana-chat-badgeTextColor",
      config.badgeTextColor
    );
    root.style.setProperty("--asana-chat-fontFamily", config.fontFamily);
    root.style.setProperty("--asana-chat-width", config.width);
  }, [config]);

  return (
    <>
      <Helmet>
        {config.fontFamily.includes("Lato") && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
              rel="stylesheet"
            />
          </>
        )}
      </Helmet>
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
    </>
  );
}
