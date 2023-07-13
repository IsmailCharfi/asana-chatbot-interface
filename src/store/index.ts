import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { ThunkAction } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import type { AnyAction } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { reducer as behaviorReducer } from "./slices/behavior";
import { reducer as messagesReducer } from "./slices/messages";
import { reducer as configReducer } from "./slices/config";

const rootReducer = combineReducers({
  behavior: behaviorReducer,
  messages: messagesReducer,
  config: configReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, undefined, AnyAction>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
