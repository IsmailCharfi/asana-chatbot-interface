import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { ConfigState, MessageHistory, MessageTypes } from "../types";
import botIcon from "../../assets/robot.png";
import closeIcon from "../../assets/close.svg";
import resetIcon from "../../assets/reset.svg";
import openLauncherIcon from "../../assets/launcher_button.svg";
import closeLauncherIcon from "../../assets/clear-button.svg";

const initialState: ConfigState = {
  apiPath: null,
  primaryColor: "#fa5e88",
  secondaryColor: "#f4f7f9",
  primaryTextColor: "#ffffff",
  secondaryTextColor: "#000000",
  badgeColor: "#f22424",
  backgroundImage:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgzIiBoZWlnaHQ9IjE4NSIgdmlld0JveD0iMCAwIDE4MyAxODUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNzcgMTdDMTc5LjIwOSAxNyAxODEgMTUuMjA5MSAxODEgMTNDMTgxIDEwLjc5MDkgMTc5LjIwOSA5IDE3NyA5QzE3NC43OTEgOSAxNzMgMTAuNzkwOSAxNzMgMTNDMTczIDE1LjIwOTEgMTc0Ljc5MSAxNyAxNzcgMTdaIiBzdHJva2U9IiNEMkQyRDIiIHN0cm9rZS13aWR0aD0iMS4yNSIvPgo8cGF0aCBkPSJNMjEuNSAxLjVMNDQuNSAxMi41TTE1LjUgOTYuNUwxMS43MSAxMDYuODc3TTI4LjAzNyAxMzIuNEwzMy45MzUgMTM0LjYwM0wzMC40NzUgMTQwLjU1TDM2LjU0NyAxNDIuOTQyTDMyLjYxNCAxNDguN00xNjEuMzQ3IDE4NC4wN0wxNjIuMDQgMTc0Ljc1NEwxNzIuMzMyIDE3NC44MDZMMTcyLjc0OCAxNjUuNTg0TDE4Mi4wMjIgMTY1LjkxNk0xLjUgNDkuNUMxLjUgNDkuNSA3LjYzMSA1NS45MTMgOC4zNDcgNjQuMzA1QzkuMDYyIDcyLjY5OCA1LjgyNyA3OS4xMTEgNS44MjcgNzkuMTExTTEyNS41NTUgOTFDMTI1LjU1NSA5MSAxMTguMTExIDkxIDExMS44ODUgOTcuMTkyQzEwNS42NTggMTAzLjM4NCAxMDcuMDQ3IDEwOS4yMDQgMTA3LjA0NyAxMDkuMjA0TTEwOS4yODcgMTc3LjgzQzEwOS4yODcgMTc3LjgzIDEwNS4yNjEgMTY4LjgwNSA5MS4xNDIgMTY4LjgwNUM3Ny4wMjMgMTY4LjgwNSA3Mi45OTcgMTc0LjUwNSA3Mi45OTcgMTc0LjUwNSIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTg2LjcxNiAzNy4xNDZMOTEuOTU5IDI3LjYyNUgxMDMuMDUyTDEwOC40NjggMzcuMTQ2TDEwMy4wNTggNDYuMzMxSDkxLjk1M0w4Ni43MTYgMzcuMTQ2Wk0xNTAuNjI1IDUyLjYyNUgxNjEuMzc1VjYzLjM3NUgxNTAuNjI1VjUyLjYyNVoiIHN0cm9rZT0iI0QyRDJEMiIgc3Ryb2tlLXdpZHRoPSIxLjI1Ii8+CjxwYXRoIGQ9Ik03Mi41IDEwQzczLjMyODQgMTAgNzQgOS4zMjg0MyA3NCA4LjVDNzQgNy42NzE1NyA3My4zMjg0IDcgNzIuNSA3QzcxLjY3MTYgNyA3MSA3LjY3MTU3IDcxIDguNUM3MSA5LjMyODQzIDcxLjY3MTYgMTAgNzIuNSAxMFoiIGZpbGw9IiNEMkQyRDIiLz4KPHBhdGggZD0iTTE3MS41IDk4QzE3Mi4zMjggOTggMTczIDk3LjMyODQgMTczIDk2LjVDMTczIDk1LjY3MTYgMTcyLjMyOCA5NSAxNzEuNSA5NUMxNzAuNjcyIDk1IDE3MCA5NS42NzE2IDE3MCA5Ni41QzE3MCA5Ny4zMjg0IDE3MC42NzIgOTggMTcxLjUgOThaIiBmaWxsPSIjRDJEMkQyIi8+CjxwYXRoIGQ9Ik04Mi41IDEzN0M4My4zMjg0IDEzNyA4NCAxMzYuMzI4IDg0IDEzNS41Qzg0IDEzNC42NzIgODMuMzI4NCAxMzQgODIuNSAxMzRDODEuNjcxNiAxMzQgODEgMTM0LjY3MiA4MSAxMzUuNUM4MSAxMzYuMzI4IDgxLjY3MTYgMTM3IDgyLjUgMTM3WiIgZmlsbD0iI0QyRDJEMiIvPgo8cGF0aCBkPSJNMTQuNSAyNkMxNS4zMjg0IDI2IDE2IDI1LjMyODQgMTYgMjQuNUMxNiAyMy42NzE2IDE1LjMyODQgMjMgMTQuNSAyM0MxMy42NzE2IDIzIDEzIDIzLjY3MTYgMTMgMjQuNUMxMyAyNS4zMjg0IDEzLjY3MTYgMjYgMTQuNSAyNloiIGZpbGw9IiNEMkQyRDIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05NCA3Mkg5N1Y3NUg5NFY3MlpNMTI3IDE1NkgxMzBWMTU5SDEyN1YxNTZaTTQyIDE3NEg0NVYxNzdINDJWMTc0WiIgZmlsbD0iI0QyRDJEMiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQwLjM4NCA1Mi4xMjJMNDYuMTQyIDQ3LjY2OEw1Mi41OTUgNTEuODczTDUwLjMwMSA1OS4yMzZINDIuNTExTDQwLjM4NCA1Mi4xMjJaTTEzMS4xOTUgNS4wMzAwM0wxNDUuMDI1IDEwLjA5MkwxMzQuOTM1IDE3LjE0TDEzMS4xOTUgNS4wMzAwM1pNNDguMTk1IDEwMC4wM0w2My4wMjUgMTA1LjQ1OUw1Mi4yMDUgMTEzLjAxNkw0OC4xOTUgMTAwLjAzWk02LjIxMzAxIDE2Mi40OTVMMTcuNTQxIDE4My4zOTJMMy4yNjUwMSAxODFMNi4yMTMwMSAxNjIuNDk1WiIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiLz4KPHBhdGggZD0iTTE1MC4wNSAxMjguNDY4QzE1MC4wNSAxMjguNDY4IDE0OS41NCAxMzAuNjUxIDE1MS4wNDUgMTMxLjgzNEMxNTIuNjA1IDEzMy4wNiAxNTkuNjg3IDEyOS45MzkgMTU1LjAxMiAxMjQuMDQ5QzE1Mi42NDUgMTIxLjU3MiAxNDguNTEyIDEyMC44MjMgMTQ1LjY4MiAxMjQuMDQ5QzE0MC40NzQgMTI5Ljk4NSAxNDUuNjgyIDE0MS41NTkgMTU3LjI5MiAxMzcuNzc5QzE2OS43NSAxMzEuNTIyIDE2Mi45MjUgMTE2LjEyMyAxNTIuMjE5IDExNS4xMjVDMTQ1LjYxNyAxMTQuNTE5IDEzOC4xNzYgMTE2Ljg4MSAxMzYuMDYyIDEyNS4zOTNDMTM0LjM0NCAxMzIuMzEzIDEzNy42NDYgMTQyLjc4IDE0OC41MTIgMTQ1Ljg2OUMxNTkuMzc4IDE0OC45NTkgMTY3Ljg0MyAxNDEuNTU5IDE2Ny44NDMgMTQxLjU1OSIgc3Ryb2tlPSIjRDJEMkQyIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K",
  badgeTextColor: "#ffffff",
  fontFamily: "Lato, sans-serif",
  botName: "Assistant Asana",
  botIcon: botIcon,
  openLauncherIcon: openLauncherIcon,
  closeLauncherIcon: closeLauncherIcon,
  closeIcon: closeIcon,
  resetIcon: resetIcon,
  confirmText: "Êtes-vous sûr.es de vouloir réinitialiser l'assistant Asana ?",
  width: "550px",
  errorMessage: "Une erreur est survenue. Merci de réessayer plus tard.",
  startMessage:
    "Bonjour! je suis votre assistant Asana n'hésitez pas à me poser des questions!",
  showConfirm: true,
  showReset: true,
  showEmoji: true,
  sendMessageApiCall: null,
  onLauncherOpen: () => {},
  onLauncherClose: () => {},
  onReset: () => {},
  afterReset: () => {},
  onOpenEmoji: () => {},
  onSendMessage: (message: string, history: MessageHistory[]) => {},
  onReceiveMessage: (message: string) => {},
  onWaiting: (clientMessage: string) => {},
};

const slice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state: ConfigState, action: PayloadAction<Partial<ConfigState>>) {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const reducer = slice.reducer;

export const setConfig =
  (config: Partial<ConfigState>): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setConfig(config));
  };

export default slice;
