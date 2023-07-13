import { useRef, useState, useImperativeHandle, useEffect } from "react";
import { Picker } from "emoji-mart";
import { useDispatch, useSelector } from "../../../../../../store";
import {
  addUserMessage,
  addResponseMessage,
  pushHistory,
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
import disabledSend from "../../../../../../assets/disabled-send.svg";
import activeSend from "../../../../../../assets/active-send.svg";
import disabledEmoji from "../../../../../../assets/disabled-emoji.svg";
import activeEmoji from "../../../../../../assets/active-emoji.svg";
import BotException from "../../../../../../utils/BotException";
const brRegex = /<br>/g;

export interface ISenderRef {
  onSelectEmoji: (event: any) => void;
}

export default function Footer() {
  const [pickerOffset, setOffset] = useState(0);
  const senderRef = useRef<ISenderRef>(null!);
  const pickerRef = useRef<HTMLDivElement | null>(null);
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
  } = useSelector((state) => ({
    messages: state.messages.messages,
    disabledInput: state.behavior.disabledInput,
    history: state.messages.history,
    apiPath: state.config.apiPath,
    errorMessage: state.config.errorMessage,
    showEmoji: state.config.showEmoji,
    onOpenEmoji: state.config.onOpenEmoji,
    onSendMessage: state.config.onSendMessage,
    onReceiveMessage: state.config.onReceiveMessage,
    onWaiting: state.config.onWaiting,
    sendMessageApiCall: state.config.sendMessageApiCall,
  }));
  const showChat = useSelector((state) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0);

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
        !pickerRef.current.contains(event.target as Node)
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
        client: userInput,
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

      if (apiPath) {
        const response = await fetch(`${apiPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            history,
            prompt: userInput.trim(),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          success(userInput, data.text);
        } else {
          throw new Error();
        }
      } else if (sendMessageApiCall) {
        const data = await sendMessageApiCall(userInput, history, messages);
        success(userInput, data.text);
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
              height: "70%"
            }}
            onSelect={onSelectEmoji}
          />
        </div>
      )}
      <div ref={refContainer} className="asana-chat-sender">
        {showEmoji && (
          <div className="asana-chat-picker-btn">
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
