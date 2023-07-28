import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { MessageHistory, MessagesState } from "../types";
import { MESSAGE_SENDER } from "../../constants";
import { createNewMessage } from "../../utils/messages";

const initialState: MessagesState = {
  history: [],
  messages: [],
  badgeCount: 0,
  lastMessage: "",
};

const slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addUserMessage(
      state: MessagesState,
      action: PayloadAction<{ text: string }>
    ) {
      state.messages = [
        ...state.messages,
        createNewMessage(action.payload.text, MESSAGE_SENDER.CLIENT),
      ];
    },
    addResponseMessage(
      state: MessagesState,
      action: PayloadAction<{ text: string; unread: boolean | null }>
    ) {
      state.messages = [
        ...state.messages,
        createNewMessage(
          action.payload.text,
          MESSAGE_SENDER.RESPONSE,
          action.payload.unread
        ),
      ];
      state.badgeCount++;
    },
    dropMessages(state: MessagesState, action: PayloadAction) {
      state.messages = [];
      state.badgeCount = 0;
      state.lastMessage = "";
      state.history = [];
    },
    markAllMessagesRead(state: MessagesState, action: PayloadAction) {
      state.messages = state.messages.map((message) => ({
        ...message,
        unread: false,
      }));
      state.badgeCount = 0;
    },
    setBadgeCount(
      state: MessagesState,
      action: PayloadAction<{ count: number }>
    ) {
      state.badgeCount = action.payload.count;
    },
    setLastMessage(
      state: MessagesState,
      action: PayloadAction<{ message: string }>
    ) {
      state.lastMessage = action.payload.message;
    },
    pushHistory(
      state: MessagesState,
      action: PayloadAction<{ messageHistory: MessageHistory }>
    ) {
      const array = [...state.history];

      array.push(action.payload.messageHistory);

      if (array.length > 3) {
        array.shift();
      }

      state.history = array;
    },
    clearHistory(state: MessagesState, action: PayloadAction) {
      state.history = [];
    },
  },
});

export const reducer = slice.reducer;

export const addUserMessage =
  (text: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.addUserMessage({ text }));
  };

export const addResponseMessage =
  (text: string, unread: boolean | null = null): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.addResponseMessage({ text, unread }));
  };

export const dropMessages = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.dropMessages());
};

export const markAllMessagesRead = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.markAllMessagesRead());
};

export const setBadgeCount =
  (count: number): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setBadgeCount({ count }));
  };

export const setLastMessage =
  (message: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setLastMessage({ message }));
  };

export const pushHistory =
  (messageHistory: MessageHistory): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.pushHistory({ messageHistory }));
  };

export const clearHistory = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.clearHistory());
};

export default slice;
