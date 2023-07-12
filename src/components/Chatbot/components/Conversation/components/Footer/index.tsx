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
//@ts-ignore
import send from "./assets/send.svg";
//@ts-ignore
import emoji from "./assets/emoji.svg";
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
    //@ts-ignore
    dispatch(toggleInputDisabled());
    //@ts-ignore
    dispatch(addUserMessage(userInput));
    //@ts-ignore
    dispatch(toggleMsgLoader());
    setTimeout(() => {
      //@ts-ignore
      dispatch(addResponseMessage(userInput));
      //@ts-ignore
      dispatch(toggleMsgLoader());
      //@ts-ignore
      dispatch(toggleInputDisabled());
    }, 5000);
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
        <button
          className="asana-chat-picker-btn"
          type="submit"
          onClick={handlerPressEmoji}
        >
          <img src={emoji} className="asana-chat-picker-icon" alt="" />
        </button>
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
        <button
          type="submit"
          className="asana-chat-send"
          onClick={handlerSendMessage}
        >
          <img src={send} className="asana-chat-send-icon" alt={"Envoyer"} />
        </button>
      </div>
    </div>
  );
}
