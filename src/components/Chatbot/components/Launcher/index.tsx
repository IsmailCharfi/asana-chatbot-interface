import cn from "classnames";
import Badge from "./components/Badge";
import "./styles.scss";
//@ts-ignore
import launcher_open from "./assets/launcher_button.svg";
//@ts-ignore
import launcher_close from "./assets/clear-button.svg";
import { useDispatch, useSelector } from "../../../../store";
import { toggleChat } from "../../../../store/slices/behavior";
import { setBadgeCount } from "../../../../store/slices/messages";

function Launcher() {
  const dispatch = useDispatch();
  const { badgeCount, showChat } = useSelector((state) => ({
    badgeCount: state.messages.badgeCount,
    showChat: state.behavior.showChat,
  }));

  const toggle = () => {
    //@ts-ignore
    dispatch(toggleChat());
    //@ts-ignore
    if (!showChat) dispatch(setBadgeCount(0));
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
          src={launcher_close}
          className="asana-chat-close-launcher"
          alt={"Fermer le chatbot asana"}
        />
      ) : (
        <img
          src={launcher_open}
          className="asana-chat-open-launcher"
          alt={"Ouvrir le chatbot asana"}
        />
      )}
    </button>
  );
}

export default Launcher;
