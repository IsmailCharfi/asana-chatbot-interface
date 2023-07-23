import { MessageTypes } from "../../../../../../../../store/types";
import "./styles.scss";
import ReactMarkdown from "react-markdown";

type Props = {
  message: MessageTypes;
};

function Message({ message }: Props) {
  return (
    <div className={`asana-chat-${message.sender}`}>
      <div className="asana-chat-message-text">
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;
