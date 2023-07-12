import { Provider } from "react-redux";
import store from "./store";
import AsanaChatbot from "./components/Chatbot";

export default function App() {
  return (
    <Provider store={store}>
      <AsanaChatbot />
    </Provider>
  );
}
