import "./styles.scss";
import logo from "../../../Header/assets/robot.png";

function Loader() {
  return (
    <>
      <div className={"asana-chat-message"}>
        <img src={logo} className={"asana-chat-avatar"} alt="profile" />
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
