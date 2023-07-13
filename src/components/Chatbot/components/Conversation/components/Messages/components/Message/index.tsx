import { MessageTypes } from "../../../../../../../../store/types";
import "./styles.scss";
import sanitizeHtml from "sanitize-html";

type Props = {
  message: MessageTypes;
};

function Message({ message }: Props) {
  const sanitizedHTML = sanitizeHtml(message.text);
  return (
    <div className={`asana-chat-${message.sender}`}>
      <div
        className="asana-chat-message-text"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML.replace(/\n$/, "") }}
      />
    </div>
  );
}

export default Message;
