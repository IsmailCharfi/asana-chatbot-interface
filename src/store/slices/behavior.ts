import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "../index";
import { BehaviorState } from "../types";

const initialState: BehaviorState = {
  showChat: false,
  disabledInput: false,
  messageLoader: false,
  reset: false
};

const slice = createSlice({
  name: "behavior",
  initialState,
  reducers: {
    toggleChat(state: BehaviorState, action: PayloadAction) {
      state.showChat = !state.showChat;
    },
    toggleInputDisabled(state: BehaviorState, action: PayloadAction) {
      state.disabledInput = !state.disabledInput;
    },
    toggleMessageLoader(state: BehaviorState, action: PayloadAction) {
      state.messageLoader = !state.messageLoader;
    },
    resetChat(state: BehaviorState, action: PayloadAction) {
      state.reset = !state.reset;
    },
  },
});

export const reducer = slice.reducer;

export const toggleChat = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.toggleChat());
};

export const toggleInputDisabled = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.toggleInputDisabled());
};

export const toggleMsgLoader = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.toggleMessageLoader());
};

export const resetChat = (): AppThunk => async (dispatch) => {
  dispatch(slice.actions.resetChat());
};


export default slice;
