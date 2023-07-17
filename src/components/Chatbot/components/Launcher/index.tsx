import cn from "classnames";
import Badge from "./components/Badge";
import "./styles.scss";
import { useDispatch, useSelector } from "../../../../store";
import { toggleChat } from "../../../../store/slices/behavior";
import {
  setBadgeCount,
  setLastMessage,
} from "../../../../store/slices/messages";
import { CSSTransition } from "react-transition-group";
import sanitizeHtml from "sanitize-html";

function Launcher() {
  const dispatch = useDispatch();
  const {
    badgeCount,
    showChat,
    openIcon,
    closeIcon,
    onOpen,
    onClose,
    showPreview,
    lastMessage,
    firstMessage,
  } = useSelector((state) => ({
    badgeCount: state.messages.badgeCount,
    showChat: state.behavior.showChat,
    openIcon: state.config.config.openIcon,
    closeIcon: state.config.config.closeIcon,
    onOpen: state.config.config.onOpen,
    onClose: state.config.config.onClose,
    firstMessage: state.config.config.firstMessage,
    showPreview: state.config.config.showPreview,
    lastMessage: state.messages.lastMessage,
  }));

  const toggle = () => {
    dispatch(toggleChat());
    if (!showChat) {
      onOpen();
      dispatch(setBadgeCount(0));
      dispatch(setLastMessage(""));
    } else {
      onClose();
    }
  };

  function truncateString(string: string, limit: number) {
    const sanitizedHTML = sanitizeHtml(string);

    if (sanitizedHTML.length > limit) {
      return sanitizedHTML.substring(0, limit) + "...";
    }
    return sanitizedHTML;
  }

  return (
    <>
      <button
        type="button"
        className={cn("asana-chat-launcher", {
          "asana-chat-hide-sm": showChat,
        })}
        onClick={toggle}
        aria-controls={"chatId"}
      >
        {!showChat && <Badge badge={badgeCount} />}
        {showChat ? (
          <img
            src={closeIcon}
            className="asana-chat-close-launcher"
            alt={"Close"}
          />
        ) : (
          <img
            src={openIcon}
            className="asana-chat-open-launcher"
            alt={"Open"}
          />
        )}
      </button>
      <CSSTransition
        in={showPreview && !showChat && badgeCount > 0}
        timeout={300}
        classNames="asana-chat-tooltip"
        unmountOnExit
      >
        <span
          className="asana-chat-tooltip"
          onClick={toggle}
          dangerouslySetInnerHTML={{
            __html: truncateString(lastMessage, firstMessage.length).replace(
              /\n$/,
              ""
            ),
          }}
        />
      </CSSTransition>
    </>
  );
}

export default Launcher;
