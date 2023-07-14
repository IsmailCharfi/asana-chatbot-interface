import * as ReactDOM from "react-dom";
import App from "./App";
import { Config } from "./store/types";
import BotException from "./utils/BotException";

export default function AsanaChatbot(
  options: Config & { element: HTMLElement | string }
) {
  let htmlElement: HTMLElement | null;

  if (!options.element) {
    throw new BotException("The element option is required");
  }

  if (typeof options.element == "string") {
    htmlElement = document.querySelector(options.element);
    if (!htmlElement) {
      throw new BotException(
        `The element with the selector "${options.element}" can't be found `
      );
    }
  } else {
    htmlElement = options.element;
  }

  ReactDOM.render(<App config={options} />, htmlElement);
}
