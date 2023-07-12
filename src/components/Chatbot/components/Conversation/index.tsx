import cn from "classnames";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Messages from "./components/Messages";
import "./styles.scss";
import { useSelector } from "../../../../store";

function Conversation() {
  const { showChat } = useSelector((state) => state.behavior);

  return (
    <div
      id="asana-chat-conversation-container"
      className={cn({
        "asana-chat-conversation-container": true,
        "asana-chat-active": showChat,
        "asana-chat-hidden": !showChat,
      })}
      aria-live="polite"
    >
      <Header />
      <Messages />
      <Footer />
    </div>
  );
}

export default Conversation;
