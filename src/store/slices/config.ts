import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { ConfigState } from "../types";
import botIcon from "../../components/Chatbot/components/Conversation/components/Header/assets/robot.png";

const initialState: ConfigState = {
  apiPath: "https://localhost:5000",
  primaryColor: "#fa5e88",
  secondaryColor: "#f4f7f9",
  primaryTextColor: "#ffffff",
  secondatyTextColor: "#000000",
  botName: "Assistant Asana",
  botIcon: botIcon,
  errorMessage: "Une erreur est survenue. Merci de réessayer plus tard.",
  startMessage:
    "Bonjour! je suis votre assistant Asana n'hésitez pas à me poser des questions!",
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
