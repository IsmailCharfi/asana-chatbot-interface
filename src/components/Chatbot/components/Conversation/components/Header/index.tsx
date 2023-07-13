import { DialogModal, useModal } from "react-dialog-confirm";
import { useDispatch, useSelector } from "../../../../../../store";
import { resetChat, toggleChat } from "../../../../../../store/slices/behavior";
import close from "./assets/close.svg";
import reset from "./assets/reset.svg";
import "./styles.scss";

function Header() {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const { botName, botIcon } = useSelector((state) => state.config);
  const resetChatBox = () => {
    dispatch(resetChat());
    closeModal();
  };

  const toggleChatbox = () => dispatch(toggleChat());

  return (
    <div className="asana-chat-header">
      <h4 className="asana-chat-title">
        <img src={botIcon} className="asana-chat-avatar" alt="Asana bot" />
        {botName}
      </h4>
      <div className="asana-chat-actions">
        <img
          src={reset}
          className="asana-chat-action"
          alt="Reset"
          onClick={() =>
            openModal(
              <DialogModal
                titleStyle={{ fontFamily: "Lato, sans-serif" }}
                icon={"warning"}
                title={`Êtes-vous sûr.es de vouloir réinitialiser ${botName}`}
                confirm={"Oui"}
                cancel={"Non"}
                onConfirm={resetChatBox}
                onCancel={closeModal}
                hasCancel={true}
              />
            )
          }
        />
        <img
          src={close}
          className="asana-chat-action"
          alt="Fermer"
          onClick={toggleChatbox}
        />
      </div>
    </div>
  );
}

export default Header;
