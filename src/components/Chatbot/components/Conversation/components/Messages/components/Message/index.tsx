import { MessageTypes } from "../../../../../../../../store/types";
import "./styles.scss";

type Props = {
  message: MessageTypes;
};

function Message({ message }: Props) {
  return (
    <div className={`asana-chat-${message.sender}`}>
      {/* <div 
              className="asana-chat-message-text" 
              dangerouslySetInnerHTML={{ __html: sanitizedHTML.replace(/\n$/,'') }} 
          />
       */}
      <div className="asana-chat-message-text">{message.text}</div>
    </div>
  );
}

export default Message;
