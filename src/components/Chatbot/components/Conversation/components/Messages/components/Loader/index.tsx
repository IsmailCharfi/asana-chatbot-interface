import { useSelector } from "../../../../../../../../store";
import "./styles.scss";

function Loader() {
  const { botIcon } = useSelector((state) => state.config);
  return (
    <>
      <div className={"asana-chat-message"}>
        <img src={botIcon} className={"asana-chat-avatar"} alt="Bot" />
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
