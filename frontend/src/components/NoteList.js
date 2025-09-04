import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  Stack,
} from "@mui/material";
import { Delete, Edit, Summarize } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNoteRequest,
  generateSummaryRequest,
} from "../redux/noteSlice.js";
import NoteForm from "./NoteForm.js";
import { useNotify } from "./NotificationProvider.js";

const NoteList = ({ notes, setNotes }) => {
  const [editingNote, setEditingNote] = useState(null);
  const dispatch = useDispatch();
  const notify = useNotify();
  const generalLoading = useSelector((state) => state.notes.loading);
  const summaryLoadingById = useSelector(
    (state) => state.notes.summaryLoadingById || {}
  );

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this note?")) return;
    dispatch(deleteNoteRequest(id));
    notify.enqueueSnackbar("Deleting note...", { variant: "info" });
  };

  const handleSummarize = (note) => {
    dispatch(generateSummaryRequest(note._id));
    notify.enqueueSnackbar("Generating summary...", { variant: "info" });
  };

  const handleEditSave = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
    setEditingNote(null);
  };

  return (
    <List sx={{ px: 0 }}>
      {notes.map((note) => {
        const isSummaryDisabled = !!note.summary && note.transcript === note.summary;
        const summaryLoading = !!summaryLoadingById[note._id];
        const isLoading = generalLoading || summaryLoading;

        return (
          <Paper
            key={note._id}
            elevation={5}
            sx={{
              mb: 3,
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: "linear-gradient(130deg, #fafafa 60%, #e3f2fd 100%)",
              boxShadow: "0 12px 20px -8px rgba(33, 150, 243, 0.3)",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <ListItem alignItems="flex-start" sx={{ px: 0, display: "block" }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.dark"
                gutterBottom
              >
                Transcript
              </Typography>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {note.transcript || "No transcript yet."}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <IconButton
                  aria-label="edit"
                  onClick={() => setEditingNote(note)}
                  color="primary"
                  size="large"
                  disabled={isLoading}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(note._id)}
                  disabled={generalLoading}
                  color="error"
                  size="large"
                >
                  <Delete />
                </IconButton>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={
                    summaryLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Summarize />
                    )
                  }
                  onClick={() => handleSummarize(note)}
                  disabled={
                    summaryLoading || isSummaryDisabled || generalLoading || !!note.summary
                  }
                  color="info"
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    fontWeight: 600,
                    boxShadow: "0 2px 8px #90caf914",
                    transition: "background-color 0.3s ease",
                    "&:hover": { backgroundColor: "#bbdefb99" },
                  }}
                >
                  {summaryLoading ? "Generating..." : "Generate Summary"}
                </Button>

                {!!note.summary && (
                  <>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="secondary.main"
                      sx={{ mt: 2 }}
                    >
                      Summary:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                    >
                      {note.summary}
                    </Typography>
                  </>
                )}
              </Box>
            </ListItem>

            <Collapse
              in={editingNote?._id === note._id}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ mt: 3, px: 1 }}>
                <NoteForm note={editingNote} onSave={handleEditSave} />
                <Button
                  sx={{ mt: 1 }}
                  variant="outlined"
                  onClick={() => setEditingNote(null)}
                  color="inherit"
                >
                  Cancel
                </Button>
              </Box>
            </Collapse>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                Last edited: {new Date(note.lastEdited).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </List>
  );
};

export default NoteList;
