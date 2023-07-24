import { useDispatch, useSelector } from "../../../../../../store";
import "./styles.scss";
import { setConfig } from "../../../../../../store/slices/config";
import { saveAs } from "file-saver";
import { MESSAGE_SENDER } from "../../../../../../constants";

function Header() {
  const {
    headerText,
    headerIcon,
    width,
    messages,
    primaryTextColor,
    initialWidth,
  } = useSelector((state) => ({
    ...state.config.config,
    initialWidth: state.config.initialWidth,
    messages: state.messages.messages,
  }));
  const dispatch = useDispatch();

  const downlaodText = () => {
    let textFileContent = "";
    messages.map((m) => {
      if (m.sender == MESSAGE_SENDER.CLIENT) {
        textFileContent += `Question: ${m.text}\n`;
      } else {
        textFileContent += `${headerText}: ${m.text}\n`;
      }
    });
    saveAs(
      new Blob([textFileContent], { type: "text/plain;charset=utf-8" }),
      "conversation.txt"
    );
  };

  const downlaodPDF = () => {
    const divContents = document.getElementById("messages")!.outerHTML;
    let styles = "";
    Array.from(document.querySelectorAll("style[asana-chatbot]")).map(
      (e) => (styles += e.outerHTML)
    );
    const printableContent = `<html><head>${styles}<style>.asana-chat-messages-container{height: 70000px; overflow-y: visible; max-height: null}</style></head><body>${divContents}</body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";

    iframe.srcdoc = printableContent;

    document.body.appendChild(iframe);

    iframe.onload = function () {
      iframe.contentWindow!.print();

      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const changeWidth = () => {
    if (initialWidth == width) {
      dispatch(setConfig({ width: "90vw" }));
    } else {
      dispatch(setConfig({ width: initialWidth }));
    }
  };

  const downloadIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M16.738 22.0081C16.5486 22.2153 16.2808 22.3333 16 22.3333C15.7192 22.3333 15.4515 22.2153 15.262 22.0081L9.92867 16.1748C9.556 15.7672 9.58432 15.1347 9.99192 14.762C10.3995 14.3893 11.0321 14.4176 11.4047 14.8252L15 18.7576V4C15 3.44772 15.4478 3 16 3C16.5523 3 17 3.44772 17 4V18.7576L20.5954 14.8252C20.968 14.4176 21.6006 14.3893 22.0082 14.762C22.4158 15.1347 22.444 15.7672 22.0714 16.1748L16.738 22.0081Z"
        fill={primaryTextColor}
      />
      <path
        d="M5 20C5 19.4477 4.55229 19 4 19C3.44772 19 3 19.4477 3 20V20.0732C2.99997 21.8967 2.99995 23.3664 3.15536 24.5224C3.31672 25.7225 3.66191 26.7329 4.46447 27.5355C5.26703 28.3381 6.27752 28.6833 7.47767 28.8447C8.63363 29 10.1034 29 11.9268 29H20.0732C21.8967 29 23.3664 29 24.5224 28.8447C25.7225 28.6833 26.7329 28.3381 27.5356 27.5355C28.3381 26.7329 28.6833 25.7225 28.8447 24.5224C29 23.3664 29 21.8967 29 20.0732V20C29 19.4477 28.5523 19 28 19C27.4477 19 27 19.4477 27 20C27 21.9139 26.9979 23.2487 26.8625 24.2559C26.7309 25.2343 26.4904 25.7523 26.1213 26.1213C25.7523 26.4904 25.2343 26.7309 24.2559 26.8625C23.2487 26.9979 21.9139 27 20 27H12C10.0861 27 8.75129 26.9979 7.74416 26.8625C6.7658 26.7309 6.24769 26.4904 5.87868 26.1213C5.50967 25.7523 5.26907 25.2343 5.13753 24.2559C5.00212 23.2487 5 21.9139 5 20Z"
        fill={primaryTextColor}
      />
    </svg>
  );

  const resizeInIcon = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_111_43)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.94617 9.27459C7.22819 8.90846 7.6855 8.90846 7.96754 9.27459L13.0231 15.8371C13.3051 16.2032 13.3051 16.7968 13.0231 17.1629L7.96754 23.7254C7.6855 24.0915 7.22819 24.0915 6.94617 23.7254C6.66413 23.3593 6.66413 22.7657 6.94617 22.3996L10.7688 17.4375H0.956849C0.55797 17.4375 0.234621 17.0178 0.234621 16.5C0.234621 15.9822 0.55797 15.5625 0.956849 15.5625L10.7688 15.5625L6.94617 10.6004C6.66413 10.2343 6.66413 9.64071 6.94617 9.27459Z"
          fill={primaryTextColor}
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.2885 23.7254C25.0064 24.0915 24.5491 24.0915 24.2671 23.7254L19.2115 17.1629C18.9295 16.7968 18.9295 16.2032 19.2115 15.8371L24.2671 9.27457C24.5491 8.90848 25.0064 8.90848 25.2885 9.27457C25.5705 9.64067 25.5705 10.2343 25.2885 10.6004L21.4658 15.5625L31.2778 15.5625C31.6766 15.5625 32 15.9822 32 16.5C32 17.0178 31.6766 17.4375 31.2778 17.4375H21.4658L25.2885 22.3996C25.5705 22.7657 25.5705 23.3593 25.2885 23.7254Z"
        fill={primaryTextColor}
      />
      <defs>
        <clipPath id="clip0_111_43">
          <rect
            width="13"
            height="15"
            fill={primaryTextColor}
            transform="matrix(-1 0 0 -1 13.2346 24)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  const resizeOutIcon = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_111_45)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.52307 23.7254C6.24105 24.0915 5.78373 24.0915 5.5017 23.7254L0.44614 17.1629C0.164112 16.7968 0.164112 16.2032 0.44614 15.8371L5.5017 9.27457C5.78373 8.90848 6.24105 8.90848 6.52307 9.27457C6.8051 9.64066 6.8051 10.2343 6.52307 10.6004L2.70042 15.5625H12.5124C12.9113 15.5625 13.2346 15.9822 13.2346 16.5C13.2346 17.0178 12.9113 17.4375 12.5124 17.4375H2.70042L6.52307 22.3996C6.8051 22.7657 6.8051 23.3593 6.52307 23.7254Z"
          fill={primaryTextColor}
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.7115 9.27458C25.9936 8.90847 26.4509 8.90847 26.7329 9.27458L31.7885 15.8371C32.0705 16.2032 32.0705 16.7968 31.7885 17.1629L26.7329 23.7254C26.4509 24.0915 25.9936 24.0915 25.7115 23.7254C25.4295 23.3593 25.4295 22.7657 25.7115 22.3996L29.5342 17.4375H19.7222C19.3234 17.4375 19 17.0178 19 16.5C19 15.9822 19.3234 15.5625 19.7222 15.5625H29.5342L25.7115 10.6004C25.4295 10.2343 25.4295 9.64071 25.7115 9.27458Z"
        fill={primaryTextColor}
      />
      <defs>
        <clipPath id="clip0_111_45">
          <rect
            width="13"
            height="15"
            fill={primaryTextColor}
            transform="translate(0.234619 9)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div className="asana-chat-header">
      <h4 className="asana-chat-title">
        <img src={headerIcon} className="asana-chat-avatar" alt="Header icon" />
        {headerText}
      </h4>

      <div className="asana-chat-actions">
        <div className="asana-chat-action" onClick={changeWidth}>
          {width != initialWidth ? resizeInIcon : resizeOutIcon}
        </div>
        <div className="asana-chat-action asana-chat-dropdown">
          <div className="asana-chat-action">{downloadIcon}</div>
          <div className="asana-chat-dropdown-content">
            <div className="asana-chat-dropdown-item" onClick={downlaodPDF}>
              PDF
            </div>
            <div className="asana-chat-dropdown-item" onClick={downlaodText}>
              Text
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
