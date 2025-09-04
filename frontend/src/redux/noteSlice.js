import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchNotesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotesSuccess(state, action) {
      state.notes = action.payload;
      state.loading = false;
    },
    fetchNotesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    createNoteRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createNoteSuccess(state, action) {
      state.notes.unshift(action.payload);
      state.loading = false;
    },
    createNoteFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateNoteRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateNoteSuccess(state, action) {
      const index = state.notes.findIndex((n) => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      state.loading = false;
    },
    updateNoteFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteNoteRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteNoteSuccess(state, action) {
      state.notes = state.notes.filter((n) => n._id !== action.payload);
      state.loading = false;
    },
    deleteNoteFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    generateSummaryRequest(state) {
      state.loading = true;
      state.error = null;
    },
    generateSummarySuccess(state, action) {
      const { id, summary } = action.payload;
      const note = state.notes.find((n) => n._id === id);
      if (note) {
        note.summary = summary;
      }
      state.loading = false;
    },
    generateSummaryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = notesSlice.actions;

export default notesSlice.reducer;
