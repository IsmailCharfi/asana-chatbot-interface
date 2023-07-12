import "./styles.scss";
import robot from "./assets/robot.png";
import close from "./assets/close.svg";
import reset from "./assets/reset.svg";
import { useDispatch } from "../../../../../../store";
import { resetChat, toggleChat } from "../../../../../../store/slices/behavior";

function Header() {
  const dispatch = useDispatch();

  //@ts-ignore
  const resetChatBox = () => dispatch(resetChat());

  //@ts-ignore
  const toggleChatbox = () => dispatch(toggleChat());

  return (
    <div className="asana-chat-header">
      <h4 className="asana-chat-title">
        <img src={robot} className="asana-chat-avatar" alt="Asana bot" />
        Asana chatbot
      </h4>
      <div className="asana-chat-actions">
        <img
          src={reset}
          className="asana-chat-action"
          alt="Reset"
          onClick={resetChatBox}
        />
        <img
          src={close}
          className="asana-chat-action"
          alt="Fermer"
          onClick={toggleChatbox}
        />
      </div>
    </div>
  );
}

export default Header;
