import { DialogModal, useModal } from "react-dialog-confirm";
import { useDispatch, useSelector } from "../../../../../../store";
import { resetChat, toggleChat } from "../../../../../../store/slices/behavior";
import "./styles.scss";

function Header() {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const {
    botName,
    botIcon,
    confirmText,
    closeIcon,
    resetIcon,
    onLauncherClose,
    onReset,
    afterReset,
    showConfirm,
    showReset,
    fontFamily,
  } = useSelector((state) => state.config);

  const resetChatBox = () => {
    dispatch(resetChat());
    closeModal();
  };

  const toggleChatbox = () => {
    onLauncherClose();
    dispatch(toggleChat());
  };

  const openConfirm = () => {
    onReset();
    if (showConfirm) {
      openModal(
        <DialogModal
          titleStyle={{ fontFamily }}
          icon={"warning"}
          title={ confirmText }
          confirm={"Oui"}
          cancel={"Non"}
          onConfirm={resetChatBox}
          onCancel={() => closeModal()}
          hasCancel={true}
        />
      );
    } else {
      resetChatBox();
    }
    afterReset();
  };

  return (
    <div className="asana-chat-header">
      <h4 className="asana-chat-title">
        <img src={botIcon} className="asana-chat-avatar" alt="Asana bot" />
        {botName}
      </h4>
      <div className="asana-chat-actions">
        {showReset && (
          <img
            src={resetIcon}
            className="asana-chat-action"
            alt="Reset"
            onClick={openConfirm}
          />
        )}
        <img
          src={closeIcon}
          className="asana-chat-action"
          alt="Fermer"
          onClick={toggleChatbox}
        />
      </div>
    </div>
  );
}

export default Header;
