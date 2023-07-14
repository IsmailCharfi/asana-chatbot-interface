import { useSelector } from "../../../../../../store";
import "./styles.scss";

function Header() {
  const { headerText, headerIcon } = useSelector(
    (state) => state.config.config
  );

  return (
    <div className="asana-chat-header">
      <h4 className="asana-chat-title">
        <img src={headerIcon} className="asana-chat-avatar" alt="Header icon" />
        {headerText}
      </h4>
    </div>
  );
}

export default Header;
