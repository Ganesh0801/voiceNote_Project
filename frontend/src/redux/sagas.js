import { call, put, takeLatest, all } from "redux-saga/effects";
import * as api from "../api/notes.js";
import {
  fetchNotesRequest,
  fetchNotesSuccess,
  fetchNotesFailure,
  createNoteRequest,
  createNoteSuccess,
  createNoteFailure,
  updateNoteRequest,
  updateNoteSuccess,
  updateNoteFailure,
  deleteNoteRequest,
  deleteNoteSuccess,
  deleteNoteFailure,
  generateSummaryRequest,
  generateSummarySuccess,
  generateSummaryFailure,
} from "./noteSlice.js";

function* fetchNotesSaga() {
  try {
    const response = yield call(api.getNotes);
    yield put(fetchNotesSuccess(response.data));
  } catch (err) {
    yield put(fetchNotesFailure(err.message));
  }
}

function* createNoteSaga(action) {
  try {
    const response = yield call(api.createNote, action.payload);
    yield put(createNoteSuccess(response.data));
  } catch (err) {
    yield put(createNoteFailure(err.message));
  }
}

function* updateNoteSaga(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateNote, id, data);
    yield put(updateNoteSuccess(response.data));
  } catch (err) {
    yield put(updateNoteFailure(err.message));
  }
}

function* deleteNoteSaga(action) {
  try {
    yield call(api.deleteNote, action.payload);
    yield put(deleteNoteSuccess(action.payload));
  } catch (err) {
    yield put(deleteNoteFailure(err.message));
  }
}

function* generateSummarySaga(action) {
  try {
    const response = yield call(api.generateSummary, action.payload);
    yield put(
      generateSummarySuccess({
        id: action.payload,
        summary: response.data.summary,
      })
    );
  } catch (err) {
    yield put(generateSummaryFailure(err.message));
  }
}

export default function* watchNotes() {
  yield all([
    takeLatest(fetchNotesRequest.type, fetchNotesSaga),
    takeLatest(createNoteRequest.type, createNoteSaga),
    takeLatest(updateNoteRequest.type, updateNoteSaga),
    takeLatest(deleteNoteRequest.type, deleteNoteSaga),
    takeLatest(generateSummaryRequest.type, generateSummarySaga),
  ]);
}
