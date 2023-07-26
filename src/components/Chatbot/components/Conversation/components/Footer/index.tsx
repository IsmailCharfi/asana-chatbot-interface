import { useRef, useState, useImperativeHandle, useEffect } from "react";
import { Picker } from "emoji-mart";
import { useDispatch, useSelector } from "../../../../../../store";
import {
  addUserMessage,
  addResponseMessage,
  pushHistory,
  setLastMessage,
} from "../../../../../../store/slices/messages";
import {
  toggleMsgLoader,
  toggleInputDisabled,
} from "../../../../../../store/slices/behavior";
import cn from "classnames";
import {
  getCaretIndex,
  getSelection,
  insertNodeAtCaret,
  isFirefox,
  updateCaret,
} from "../../../../../../utils/contentEditable";
import "./style.scss";
import BotException from "../../../../../../utils/BotException";
const brRegex = /<br>/g;

export interface ISenderRef {
  onSelectEmoji: (event: any) => void;
}

export default function Footer() {
  const [pickerOffset, setOffset] = useState(0);
  const senderRef = useRef<ISenderRef>(null!);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const pickerIconRef = useRef<HTMLDivElement | null>(null);
  const [pickerStatus, setPicker] = useState(false);
  const dispatch = useDispatch();
  const {
    disabledInput,
    history,
    apiPath,
    errorMessage,
    onOpenEmoji,
    onReceiveMessage,
    onSendMessage,
    onWaiting,
    showEmoji,
    sendMessageApiCall,
    messages,
    showPreview,
  } = useSelector((state) => ({
    messages: state.messages.messages,
    disabledInput: state.behavior.disabledInput,
    history: state.messages.history,
    apiPath: state.config.config.apiPath,
    errorMessage: state.config.config.errorMessage,
    showEmoji: state.config.config.showEmoji,
    onOpenEmoji: state.config.config.onOpenEmoji,
    onSendMessage: state.config.config.onSendMessage,
    onReceiveMessage: state.config.config.onReceiveMessage,
    onWaiting: state.config.config.onWaiting,
    sendMessageApiCall: state.config.config.sendMessageApiCall,
    showPreview: state.config.config.showPreview,
  }));
  const showChat = useSelector((state) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0);

  const activeEmoji =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z'/%3E%3C/svg%3E%0A";
  const disabledEmoji =
    "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2ZM12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.507 13.941C15.995 15.136 14.333 15.872 12.001 15.872C9.667 15.872 8.005 15.136 6.493 13.941L6 14.434C7.127 16.154 9.2 18 12.001 18C14.801 18 16.873 16.154 18 14.434L17.507 13.941ZM8.5 8C7.672 8 7 8.671 7 9.5C7 10.329 7.672 11 8.5 11C9.328 11 10 10.329 10 9.5C10 8.671 9.328 8 8.5 8ZM15.5 8C14.672 8 14 8.671 14 9.5C14 10.329 14.672 11 15.5 11C16.328 11 17 10.329 17 9.5C17 8.671 16.328 8 15.5 8Z' fill='%23A8A8A8'/%3E%3C/svg%3E%0A";
  const activeSend =
    "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Capa_1' clip-path='url(%23clip0_105_6)'%3E%3Cg id='Group'%3E%3Cg id='send'%3E%3Cpath id='Vector' d='M0 475.429L512 256L0 36.5714V207.238L365.714 256L0 304.762V475.429Z' fill='%23141313'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_105_6'%3E%3Crect width='512' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A";
  const disabledSend =
    "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Capa_1' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 535.5 535.5' style='enable-background:new 0 0 535.5 535.5;' xml:space='preserve'%3E%3Cg%3E%3Cg id='asana-chat-send-icon'%3E%3Cpolygon points='0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 ' fill='%23cbcbcb'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A";

  useEffect(() => {
    if (showChat) inputRef.current?.focus();
  }, [showChat]);

  useEffect(() => {
    setFirefox(isFirefox());

    const sendIcon = document.getElementById("asana-chat-send-icon");
    if (sendIcon) {
      sendIcon.style.fill = "red";
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        pickerIconRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !pickerIconRef.current.contains(event.target as Node)
      ) {
        setPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useImperativeHandle(senderRef, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const showError = () => {
    dispatch(addResponseMessage(errorMessage));
    dispatch(toggleMsgLoader());
  };

  const success = (userInput: string, response: string) => {
    dispatch(
      pushHistory({
        human: userInput,
        bot: response,
      })
    );
    onReceiveMessage(response);
    dispatch(addResponseMessage(response));
    dispatch(toggleMsgLoader());
    dispatch(toggleInputDisabled());
    inputRef.current?.focus();
  };

  const handleMessageSubmit = async (userInput: any) => {
    if (!userInput.trim()) {
      return;
    }

    dispatch(toggleInputDisabled());
    dispatch(addUserMessage(userInput));
    onSendMessage(userInput, history);
    dispatch(toggleMsgLoader());
    onWaiting(userInput);

    try {
      if (!apiPath && !sendMessageApiCall) {
        throw new BotException(
          "You should provide either the apiPath or the callback function {sendMessageApiCall} to send the prompt to the API"
        );
      }
      let token = window.localStorage.getItem("asana-chatbot-token");

      if (apiPath) {
        const response = await fetch(`${apiPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            history,
            prompt: userInput.trim(),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          window.localStorage.setItem("asana-chatbot-token", data.token)
          if (showPreview) {
            dispatch(setLastMessage(data.response));
          }
          success(userInput, data.response);
        } else {
          throw new Error();
        }
      } else if (sendMessageApiCall) {
        const data = await sendMessageApiCall(userInput, history, messages, token);
        window.localStorage.setItem("asana-chatbot-token", data.token)
        success(userInput, data.response);
      }
    } catch (error) {
      showError();
      if (error instanceof BotException) {
        throw error;
      }
    }
  };

  const onSelectEmoji = (emoji: any) => {
    senderRef.current?.onSelectEmoji(emoji);
  };

  const togglePicker = () => {
    setPicker((prevPickerStatus) => !prevPickerStatus);
  };

  const sendMessage = (event: any) => {
    handleMessageSubmit(event);
    if (pickerStatus) setPicker(false);
  };

  const handlerSendMessage = () => {
    const el = inputRef.current;
    if (el.innerHTML) {
      sendMessage(el.innerText);
      el.innerHTML = "";
    }
  };

  const handlerOnSelectEmoji = (emoji: any) => {
    const el = inputRef.current;
    const { start, end } = getSelection(el);
    if (el.innerHTML) {
      const firstPart = el.innerHTML.substring(0, start);
      const secondPart = el.innerHTML.substring(end);
      el.innerHTML = `${firstPart}${emoji.native}${secondPart}`;
    } else {
      el.innerHTML = emoji.native;
    }
    updateCaret(el, start, emoji.native.length);
  };

  const handlerOnKeyPress = (event: any) => {
    const el = inputRef.current;

    if (event.charCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handlerSendMessage();
    }
    if (event.charCode === 13 && event.shiftKey) {
      event.preventDefault();
      insertNodeAtCaret(el);
      setEnter(true);
    }
  };

  const checkSize = () => {
    const senderEl = refContainer.current;
    if (senderEl && height !== senderEl.clientHeight) {
      const { clientHeight } = senderEl;
      setHeight(clientHeight);
      setOffset(clientHeight ? clientHeight - 1 : 0);
    }
  };

  const handlerOnKeyUp = (event: any) => {
    const el = inputRef.current;
    if (!el) return true;
    // Conditions need for firefox
    if (firefox && event.key === "Backspace") {
      if (el.innerHTML.length === 1 && enter) {
        el.innerHTML = "";
        setEnter(false);
      } else if (brRegex.test(el.innerHTML)) {
        el.innerHTML = el.innerHTML.replace(brRegex, "");
      }
    }
    checkSize();
  };

  const handlerOnKeyDown = (event: any) => {
    const el = inputRef.current;

    if (event.key === "Backspace" && el) {
      const caretPosition = getCaretIndex(inputRef.current);
      const character = el.innerHTML.charAt(caretPosition - 1);
      if (character === "\n") {
        event.preventDefault();
        event.stopPropagation();
        el.innerHTML =
          el.innerHTML.substring(0, caretPosition - 1) +
          el.innerHTML.substring(caretPosition);
        updateCaret(el, caretPosition, -1);
      }
    }
  };

  const handlerPressEmoji = () => {
    onOpenEmoji();
    togglePicker();
    checkSize();
  };

  return (
    <div className="asana-chat-footer">
      {pickerStatus && (
        <div ref={pickerRef}>
          <Picker
            /*  i18n={{
              categories: {
                activity: "Activités",
                custom: "Personnalisé",
                flags: "Drapeaux",
                foods: "Nourriture",
                nature: "Nature",
                objects: "Objets",
                people: "Personnes",
                places: "Places",
                recent: "Récent",
                search: "Recherche",
                symbols: "Symboles",
              },
              notfound: "Pas trouvé",
              search: "Recherche",
            }} */
            style={{
              position: "absolute",
              bottom: pickerOffset,
              left: "0",
              width: "70%",
              height: "70%",
            }}
            onSelect={onSelectEmoji}
          />
        </div>
      )}
      <div ref={refContainer} className="asana-chat-sender">
        {showEmoji && (
          <div className="asana-chat-picker-btn" ref={pickerIconRef}>
            <img
              src={disabledInput ? disabledEmoji : activeEmoji}
              className={cn({
                "asana-chat-footer-icon": true,
                active: !disabledInput,
              })}
              alt="Emoji Picker"
              onClick={disabledInput ? () => {} : handlerPressEmoji}
            />
          </div>
        )}
        <div
          className={cn("asana-chat-new-message", {
            "asana-chat-message-disable": disabledInput,
          })}
        >
          <div
            spellCheck
            className="asana-chat-input"
            role="textbox"
            contentEditable={!disabledInput}
            ref={inputRef}
            onKeyPress={handlerOnKeyPress}
            onKeyUp={handlerOnKeyUp}
            onKeyDown={handlerOnKeyDown}
          />
        </div>
        <img
          onClick={handlerSendMessage}
          src={disabledInput ? disabledSend : activeSend}
          className={cn({
            "asana-chat-send": true,
            "asana-chat-footer-icon": true,
            active: !disabledInput,
          })}
          alt={"Envoyer"}
        />
      </div>
    </div>
  );
}
