import cn from "classnames";
import Badge from "./components/Badge";
import "./styles.scss";
import { useDispatch, useSelector } from "../../../../store";
import { toggleChat } from "../../../../store/slices/behavior";
import { setBadgeCount } from "../../../../store/slices/messages";

function Launcher() {
  const dispatch = useDispatch();
  const {
    badgeCount,
    showChat,
    openLauncherIcon,
    closeLauncherIcon,
    onLauncherClose,
    onLauncherOpen,
  } = useSelector((state) => ({
    badgeCount: state.messages.badgeCount,
    showChat: state.behavior.showChat,
    openLauncherIcon: state.config.config.openLauncherIcon,
    closeLauncherIcon: state.config.config.closeLauncherIcon,
    onLauncherOpen: state.config.config.onLauncherOpen,
    onLauncherClose: state.config.config.onLauncherClose,
  }));

  const toggle = () => {
    dispatch(toggleChat());
    if (!showChat) {
      onLauncherOpen();
      dispatch(setBadgeCount(0));
    } else {
      onLauncherClose();
    }
  };

  return (
    <button
      type="button"
      className={cn("asana-chat-launcher", { "asana-chat-hide-sm": showChat })}
      onClick={toggle}
      aria-controls={"chatId"}
    >
      {!showChat && <Badge badge={badgeCount} />}
      {showChat ? (
        <img
          src={closeLauncherIcon}
          className="asana-chat-close-launcher"
          alt={"Close"}
        />
      ) : (
        <img
          src={openLauncherIcon}
          className="asana-chat-open-launcher"
          alt={"Open"}
        />
      )}
    </button>
  );
}

export default Launcher;
