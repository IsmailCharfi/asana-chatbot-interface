import * as ReactDOM from "react-dom";
import App from "./App";
import { Config } from "./store/types";
import BotException from "./utils/BotException";

export default function Chatbot(
  config: Config,
  elementOrSelector: HTMLElement | string
) {
  let element: HTMLElement | null;

  if (typeof elementOrSelector == "string") {
    element = document.querySelector(elementOrSelector);
    if (!element) {
      throw new BotException(
        `The element with the selector "${elementOrSelector}" can't be found `
      );
    }
  } else {
    element = elementOrSelector;

    if (!element) {
      throw new BotException("The element provided does not exist");
    }
  }

  ReactDOM.render(<App config={config} />, element);
}
