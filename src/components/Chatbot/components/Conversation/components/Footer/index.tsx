import { useRef, useState, useImperativeHandle, useEffect } from "react";
import { Picker } from "emoji-mart";
import { useDispatch, useSelector } from "../../../../../../store";
import {
  addUserMessage,
  addResponseMessage,
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
import disabledSend from "./assets/disabled-send.svg";
import activeSend from "./assets/active-send.svg";
import disabledEmoji from "./assets/disabled-emoji.svg";
import activeEmoji from "./assets/active-emoji.svg";
const brRegex = /<br>/g;

export interface ISenderRef {
  onSelectEmoji: (event: any) => void;
}

export default function Footer() {
  const [pickerOffset, setOffset] = useState(0);
  const senderRef = useRef<ISenderRef>(null!);
  const [pickerStatus, setPicket] = useState(false);
  const dispatch = useDispatch();
  const { disabledInput } = useSelector((state) => ({
    disabledInput: state.behavior.disabledInput,
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

  useImperativeHandle(senderRef, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const handleMessageSubmit = async (userInput: any) => {
    if (!userInput.trim()) {
      return;
    }

    dispatch(toggleInputDisabled());
    dispatch(addUserMessage(userInput));
    dispatch(toggleMsgLoader());

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          ContentType: "application/json",
        },
        body: JSON.stringify({
          prompt: userInput.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addResponseMessage(data.text));
        dispatch(toggleMsgLoader());
        dispatch(toggleInputDisabled());
      } else {
        throw new Error();
      }
    } catch (error) {
      dispatch(
        addResponseMessage(
          "Une erreur est survenue. Merci de réessayer plus tard."
        )
      );
      dispatch(toggleMsgLoader());
    }
  };

  const onSelectEmoji = (emoji: any) => {
    senderRef.current?.onSelectEmoji(emoji);
  };

  const togglePicker = () => {
    setPicket((prevPickerStatus) => !prevPickerStatus);
  };

  const sendMessage = (event: any) => {
    handleMessageSubmit(event);
    if (pickerStatus) setPicket(false);
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
    togglePicker();
    checkSize();
  };

  return (
    <div className="asana-chat-footer">
      {pickerStatus && (
        <Picker
          i18n={{
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
          }}
          style={{
            position: "absolute",
            bottom: pickerOffset,
            left: "0",
            width: "100%",
          }}
          onSelect={onSelectEmoji}
        />
      )}
      <div ref={refContainer} className="asana-chat-sender">
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
