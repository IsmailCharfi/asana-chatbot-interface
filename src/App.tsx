import { Provider } from "react-redux";
import { DialogProvider } from "react-dialog-confirm";
import store from "./store";
import AsanaChatbot from "./components/Chatbot";

export default function App() {
  return (
    <Provider store={store}>
      <DialogProvider>
        <div
          style={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Your Website here
        </div>
        <AsanaChatbot />
      </DialogProvider>
    </Provider>
  );
}
