import format from 'date-fns/format';
import { Link } from '../../../../../../../../store/types';
import "./styles.scss"

type Props = {
  message: Link;
  showTimeStamp: boolean;
}

function Snippet({ message, showTimeStamp }: Props) {
  return (
    <div>
      <div className="asana-chat-snippet">
        <h5 className="asana-chat-snippet-title">{message.title}</h5>
        <div className="asana-chat-snippet-details">
          <a href={message.link} target={message.target} className=" link">
            {message.link}
          </a>
        </div>
      </div>
      {showTimeStamp && <span className="asana-chat-timestamp">{format(message.timestamp, 'hh:mm')}</span>}
    </div>
  );
}

export default Snippet;
