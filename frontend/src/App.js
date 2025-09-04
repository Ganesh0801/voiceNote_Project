import React, { useEffect } from "react";
import { Container, Typography, Divider, Paper, Box } from "@mui/material";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotesRequest } from "./redux/noteSlice.js";
import NotificationProvider from "./components/NotificationProvider";

const App = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);

  useEffect(() => {
    dispatch(fetchNotesRequest());
  }, [dispatch]);

  return (
    <NotificationProvider>
      {/* Gradient Background */}
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Paper card for glassmorphism effect */}
          <Paper
            elevation={7}
            sx={{
              width: "100%",
              p: { xs: 2, sm: 4 },
              mt: { xs: 2, sm: 5 },
              borderRadius: 5,
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.1)",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #7b4397, #dc2430)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: 1,
              }}
            >
              Voice Notes
            </Typography>

            <NoteForm onSave={() => dispatch(fetchNotesRequest())} />

            <Divider sx={{ my: 4, borderColor: "#c3cfe2" }} />

            <NoteList notes={notes} setNotes={() => {}} />
          </Paper>
        </Container>
      </Box>
    </NotificationProvider>
  );
};

export default App;
