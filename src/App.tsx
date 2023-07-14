import { Provider } from "react-redux";
import store from "./store";
import AsanaChatbot from "./components/Chatbot";
import { Config } from "./store/types";
import { HelmetProvider } from "react-helmet-async";

type AppProps = {
  config: Partial<Config>;
};

export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AsanaChatbot config={props.config} />
      </HelmetProvider>
    </Provider>
  );
}
