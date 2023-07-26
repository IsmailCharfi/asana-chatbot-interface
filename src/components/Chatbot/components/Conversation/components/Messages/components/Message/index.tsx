import { useEffect, useRef } from "react";
import { MessageTypes } from "../../../../../../../../store/types";
import "./styles.scss";
import ReactMarkdown from "react-markdown";

type Props = {
  message: MessageTypes;
};

function Message({ message }: Props) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageRef.current) {
      const items = messageRef.current.querySelectorAll("a");
      Array.from(items).map(i => i.setAttribute("target", "_blank"))
    }
  }, [messageRef.current])

  return (
    <div className={`asana-chat-${message.sender}`}>
      <div ref={messageRef} className="asana-chat-message-text">
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;
