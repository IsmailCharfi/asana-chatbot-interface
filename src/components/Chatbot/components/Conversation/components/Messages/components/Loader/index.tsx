import { useSelector } from "../../../../../../../../store";
import "./styles.scss";

function Loader() {
  const { avatar } = useSelector((state) => state.config.config);
  return (
    <>
      <div className={"asana-chat-message"}>
        <img src={avatar} className={"asana-chat-avatar"} alt="Bot" />
        <div className="asana-chat-response">
          <div className="asana-chat-message-text">
            <div className="asana-chat-loader"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loader;
