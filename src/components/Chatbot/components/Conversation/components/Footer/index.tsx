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
import { setToken } from "../../../../../../store/slices/config";
import { useSpeechRecognition } from "../../../../../../hooks/useSpeechRecognition";
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
  const sr = useSpeechRecognition();
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
    showMic,
    sendMessageApiCall,
    messages,
    showPreview,
    historyLimit,
    token,
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
    historyLimit: state.config.config.historyLimit,
    showMic: state.config.config.showMic,
    token: state.config.token,
  }));
  const showChat = useSelector((state) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0);
  const micNotAvailable =
    !sr.supportsSpeechRecognition || disabledInput || sr.error;

  const activeEmoji =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z'/%3E%3C/svg%3E%0A";
  const disabledEmoji =
    "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2ZM12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.507 13.941C15.995 15.136 14.333 15.872 12.001 15.872C9.667 15.872 8.005 15.136 6.493 13.941L6 14.434C7.127 16.154 9.2 18 12.001 18C14.801 18 16.873 16.154 18 14.434L17.507 13.941ZM8.5 8C7.672 8 7 8.671 7 9.5C7 10.329 7.672 11 8.5 11C9.328 11 10 10.329 10 9.5C10 8.671 9.328 8 8.5 8ZM15.5 8C14.672 8 14 8.671 14 9.5C14 10.329 14.672 11 15.5 11C16.328 11 17 10.329 17 9.5C17 8.671 16.328 8 15.5 8Z' fill='%23A8A8A8'/%3E%3C/svg%3E%0A";
  const activeSend =
    "data:image/svg+xml,%3Csvg width='512' height='512' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Capa_1' clip-path='url(%23clip0_105_6)'%3E%3Cg id='Group'%3E%3Cg id='send'%3E%3Cpath id='Vector' d='M0 475.429L512 256L0 36.5714V207.238L365.714 256L0 304.762V475.429Z' fill='%23141313'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_105_6'%3E%3Crect width='512' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A";
  const disabledSend =
    "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Capa_1' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 535.5 535.5' style='enable-background:new 0 0 535.5 535.5;' xml:space='preserve'%3E%3Cg%3E%3Cg id='asana-chat-send-icon'%3E%3Cpolygon points='0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 ' fill='%23cbcbcb'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A";

  const activeMic =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512' fill='none'%3E%3Cg clip-path='url(%23clip0_204_2)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M256 9.27603e-05C231.04 9.27603e-05 206.784 9.28009 188.672 26.2721C179.675 34.608 172.487 44.7042 167.555 55.9338C162.623 67.1635 160.051 79.2871 160 91.5521V260.48C160 285.28 170.496 308.704 188.672 325.76C206.784 342.72 231.008 352.032 256 352.032C280.96 352.032 305.216 342.752 323.328 325.76C332.329 317.42 339.519 307.319 344.451 296.084C349.384 284.848 351.953 272.718 352 260.448V91.5201C352 66.7201 341.472 43.2961 323.328 26.2401C305.022 9.27682 280.957 -0.102023 256 9.27603e-05ZM221.504 61.2801C230.911 52.6527 243.236 47.9078 256 48.0001C269.216 48.0001 281.6 52.9281 290.496 61.2801C299.328 69.6001 304 80.5121 304 91.5521V260.48C304 271.52 299.328 282.432 290.496 290.752C281.084 299.368 268.759 304.101 256 304C242.784 304 230.4 299.072 221.504 290.72C212.672 282.4 208 271.488 208 260.448V91.5201C208 80.4801 212.672 69.6001 221.504 61.2801Z' fill='black'/%3E%3Cpath d='M128 216C128 209.635 125.471 203.53 120.971 199.029C116.47 194.529 110.365 192 104 192C97.6348 192 91.5303 194.529 87.0294 199.029C82.5286 203.53 80 209.635 80 216V260.32C80.0522 283.03 84.6648 305.498 93.5643 326.392C102.464 347.286 115.469 366.179 131.808 381.952C159.156 408.413 194.277 425.395 232 430.4V464H176C169.635 464 163.53 466.529 159.029 471.029C154.529 475.53 152 481.635 152 488C152 494.365 154.529 500.47 159.029 504.971C163.53 509.471 169.635 512 176 512H336C342.365 512 348.47 509.471 352.971 504.971C357.471 500.47 360 494.365 360 488C360 481.635 357.471 475.53 352.971 471.029C348.47 466.529 342.365 464 336 464H280V430.4C317.723 425.395 352.844 408.413 380.192 381.952C396.531 366.179 409.536 347.286 418.436 326.392C427.335 305.498 431.948 283.03 432 260.32V216C432 209.635 429.471 203.53 424.971 199.029C420.47 194.529 414.365 192 408 192C401.635 192 395.53 194.529 391.029 199.029C386.529 203.53 384 209.635 384 216V260.32C383.948 276.609 380.624 292.721 374.226 307.7C367.827 322.68 358.485 336.221 346.752 347.52C322.388 371.006 289.841 384.089 256 384C222.159 384.089 189.612 371.006 165.248 347.52C153.515 336.221 144.173 322.68 137.774 307.7C131.376 292.721 128.052 276.609 128 260.32V216Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_204_2'%3E%3Crect width='512' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E";
  const disabledMic =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512' fill='none'%3E%3Cg clip-path='url(%23clip0_204_6)'%3E%3Cpath d='M256 -4.20324e-05C231.04 -4.20324e-05 206.784 9.27996 188.672 26.272C180.332 34.0817 173.527 43.3831 168.608 53.696C166.093 59.4101 165.905 65.8792 168.081 71.7303C170.258 77.5815 174.629 82.3542 180.267 85.0356C185.904 87.7171 192.365 88.0962 198.278 86.0926C204.19 84.089 209.09 79.8603 211.936 74.304C214.176 69.6 217.376 65.152 221.536 61.28C230.935 52.6601 243.247 47.9158 256 48C269.216 48 281.6 52.928 290.496 61.28C299.328 69.6 304 80.512 304 91.552V201.728C304 208.093 306.528 214.198 311.029 218.699C315.53 223.199 321.635 225.728 328 225.728C334.365 225.728 340.47 223.199 344.97 218.699C349.471 214.198 352 208.093 352 201.728V91.552C352 66.752 341.472 43.328 323.328 26.272C305.027 9.29703 280.961 -0.0934618 256 -4.20324e-05Z' fill='%23AAAAAA' fill-opacity='0.666667'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M160 193.92L39.04 72.96C34.8006 68.4104 32.4927 62.3929 32.6024 56.1752C32.7121 49.9576 35.2309 44.0253 39.6281 39.6281C44.0253 35.2309 49.9576 32.7121 56.1752 32.6024C62.3929 32.4927 68.4104 34.8006 72.96 39.04L472.96 439.04C475.318 441.237 477.209 443.887 478.521 446.831C479.833 449.775 480.538 452.953 480.595 456.175C480.652 459.398 480.059 462.599 478.852 465.587C477.645 468.576 475.848 471.29 473.569 473.569C471.29 475.848 468.576 477.645 465.587 478.852C462.599 480.059 459.398 480.652 456.175 480.595C452.953 480.538 449.775 479.833 446.831 478.521C443.887 477.209 441.237 475.318 439.04 472.96L362.816 396.8C338.509 414.845 310.009 426.408 280 430.4V464H336C342.365 464 348.47 466.529 352.971 471.029C357.471 475.53 360 481.635 360 488C360 494.365 357.471 500.47 352.971 504.971C348.47 509.471 342.365 512 336 512H176C169.635 512 163.53 509.471 159.029 504.971C154.529 500.47 152 494.365 152 488C152 481.635 154.529 475.53 159.029 471.029C163.53 466.529 169.635 464 176 464H232V430.4C194.277 425.395 159.156 408.413 131.808 381.952C115.469 366.179 102.464 347.286 93.5643 326.392C84.6648 305.498 80.0522 283.03 80 260.32V216C80 209.635 82.5285 203.53 87.0294 199.029C91.5303 194.529 97.6348 192 104 192C110.365 192 116.47 194.529 120.971 199.029C125.471 203.53 128 209.635 128 216V260.32C128.052 276.609 131.376 292.721 137.774 307.7C144.173 322.68 153.515 336.221 165.248 347.52C189.612 371.006 222.159 384.089 256 384C282.08 384 307.264 376.32 328.384 362.336L305.152 339.104C290.158 347.579 273.223 352.023 256 352C231.04 352 206.784 342.72 188.672 325.728C179.675 317.392 172.487 307.296 167.555 296.066C162.623 284.837 160.051 272.713 160 260.448V193.92ZM208 241.92V260.448C208 271.488 212.672 282.4 221.504 290.72C230.4 299.04 242.784 304 256 304C260.288 304 264.512 303.488 268.544 302.496L208 241.92Z' fill='%23AAAAAA' fill-opacity='0.666667'/%3E%3Cpath d='M384.96 216C384.96 209.635 387.489 203.53 391.99 199.029C396.49 194.529 402.595 192 408.96 192C415.325 192 421.43 194.529 425.931 199.029C430.432 203.53 432.96 209.635 432.96 216V260.32C432.96 268.832 432.32 277.28 431.04 285.6C430.077 291.893 426.653 297.546 421.522 301.314C416.391 305.083 409.973 306.659 403.68 305.696C397.387 304.733 391.734 301.309 387.966 296.178C384.197 291.047 382.621 284.629 383.584 278.336C384.512 272.416 384.96 266.368 384.96 260.32V216Z' fill='%23AAAAAA' fill-opacity='0.666667'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_204_6'%3E%3Crect width='512' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E";

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

  useEffect(() => {
    const el = inputRef.current;
    if (el && sr.result) {
      el.innerHTML += ` ${sr.result}`;
    }
  }, [sr.result]);

  useImperativeHandle(senderRef, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const showError = () => {
    dispatch(addResponseMessage(errorMessage));
    dispatch(toggleMsgLoader());
    dispatch(toggleInputDisabled());
    inputRef.current?.focus();
  };

  const success = (userInput: string, response: string) => {
    dispatch(
      pushHistory(
        {
          human: userInput,
          bot: response,
        },
        historyLimit
      )
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
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            history,
            prompt: userInput.trim(),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setToken(data.token));
          if (showPreview) {
            dispatch(setLastMessage(data.response));
          }
          success(userInput, data.response);
        } else {
          throw new Error();
        }
      } else if (sendMessageApiCall) {
        const data = await sendMessageApiCall(
          userInput,
          history,
          messages,
          token
        );
        dispatch(setToken(data.token));
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
        {showMic && (
          <img
            onClick={
              micNotAvailable ? () => {} : sr.isListening ? sr.stop : sr.start
            }
            src={micNotAvailable ? disabledMic : activeMic}
            className={cn({
              "asana-chat-mic": true,
              "asana-chat-footer-icon": true,
              "asana-chat-listening": sr.isListening,
              active: !disabledInput && !sr.error,
            })}
            alt={"Mic"}
          />
        )}
        <img
          onClick={!disabledInput ? handlerSendMessage : () => {}}
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
