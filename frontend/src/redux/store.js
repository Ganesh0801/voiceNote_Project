import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import notesReducer from "./noteSlice.js";
import watchNotes from "./sagas.js";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(watchNotes);

export default store;
