import * as ReactDOM from "react-dom";
import App from "./App";
import { ConfigState } from "./store/types";

export default function Chatbot(
  config: Partial<ConfigState>,
  elementOrSelector: HTMLElement | string
) {
  let element: HTMLElement | null;

  if (typeof elementOrSelector == "string") {
    element = document.querySelector(elementOrSelector);
  } else {
    element = elementOrSelector;
  }
  ReactDOM.render(<App config={config} />, element);
}
