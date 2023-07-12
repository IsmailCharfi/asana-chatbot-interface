import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { MessagesState, LinkParams } from "../types";
import { MESSAGE_SENDER } from "../../constants";
import { createNewMessage, createLinkSnippet } from "../../utils/messages";

const initialState: MessagesState = {
  messages: [],
  badgeCount: 0,
};

const slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addUserMessage(
      state: MessagesState,
      action: PayloadAction<{ text: string; id?: string }>
    ) {
      state.messages = [
        ...state.messages,
        createNewMessage(
          action.payload.text,
          MESSAGE_SENDER.CLIENT,
          action.payload.id
        ),
      ];
    },
    addResponseMessage(
      state: MessagesState,
      action: PayloadAction<{ text: string; id?: string }>
    ) {
      state.messages = [
        ...state.messages,
        createNewMessage(
          action.payload.text,
          MESSAGE_SENDER.RESPONSE,
          action.payload.id
        ),
      ];
      state.badgeCount++;
    },
    addLinkSnippet(
      state: MessagesState,
      action: PayloadAction<{ link: LinkParams; id?: string }>
    ) {
      state.messages = [
        ...state.messages,
        createLinkSnippet(action.payload.link, action.payload.id),
      ];
    },
    dropMessages(state: MessagesState, action: PayloadAction) {
      state.messages = [];
    },
    deleteMessages(
      state: MessagesState,
      action: PayloadAction<{ count: number; id?: string }>
    ) {
      state.messages = action.payload.id
        ? state.messages.filter((_, index) => {
            const targetMsg = state.messages.findIndex(
              (tMsg) => tMsg.customId === action.payload.id
            );
            return (
              index < targetMsg - action.payload.count + 1 || index > targetMsg
            );
          })
        : state.messages.slice(0, state.messages.length - action.payload.count);
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
  },
});

export const reducer = slice.reducer;

export const addUserMessage =
  (text: string, id?: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.addUserMessage({ text, id }));
  };

export const addResponseMessage =
  (text: string, id?: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.addResponseMessage({ text, id }));
  };

export const addLinkSnippet =
  (link: LinkParams, id?: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.addLinkSnippet({ link, id }));
  };

export const dropMessages = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.dropMessages());
};

export const deleteMessages =
  (count: number, id?: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.deleteMessages({ count, id }));
  };

export const markAllMessagesRead = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.markAllMessagesRead());
};

export const setBadgeCount =
  (count: number): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.setBadgeCount({ count }));
  };

export default slice;
