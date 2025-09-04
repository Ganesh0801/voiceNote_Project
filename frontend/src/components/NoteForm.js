import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { createNoteRequest, updateNoteRequest} from "../redux/noteSlice.js";
import { useNotify } from "./NotificationProvider.js";

const NoteForm = ({ note, onSave }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.notes.loading);
  const notify = useNotify();

  const isEditMode = !!note;
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    if (isEditMode){
      setTranscript(note.transcript)
  };
  }, [isEditMode, note]);

  // Handle file upload
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setRecordedBlob(null);
    setAudioURL("");
  };

  // Start audio recording
  const handleStartRecording = async () => {
    setAudioFile(null);
    setRecordedBlob(null);
    setAudioURL("");
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunksRef.current = [];
    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setRecordedBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };
    recorder.start();
  };

  // Stop audio recording
  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  // Submit note
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      dispatch(updateNoteRequest({ id: note._id, data: { transcript } }));
      notify.enqueueSnackbar("Updating note...", { variant: "info" });
      onSave({ ...note, transcript, summary: "" });
    } else {
      let fileToUpload = audioFile;
      if (!fileToUpload && recordedBlob) {
        fileToUpload = new File([recordedBlob], "recorded_audio.webm", {
          type: recordedBlob.type,
        });
      }
      if (!fileToUpload) {
        notify.enqueueSnackbar("Please upload or record audio", {
          variant: "warning",
        });
        return;
      }
      const formData = new FormData();
      formData.append("audio", fileToUpload);
      dispatch(createNoteRequest(formData));
      notify.enqueueSnackbar("Uploading audio and transcribing", {
        variant: "info",
      });
      onSave(null);
      setAudioFile(null);
      setRecordedBlob(null);
      setAudioURL("");
      setTranscript("");

    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "relative",
        borderRadius: 5,
        p: { xs: 2, sm: 4 },
        mb: 4,
        background: "linear-gradient(120deg, #f8fafc 80%, #c2d8f0 100%)",
        boxShadow: "0 8px 24px 0 rgba(100, 149, 237, 0.08)",
        overflow: "hidden",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            zIndex: 10,
          }}
          aria-label="loading overlay"
        >
          <CircularProgress size={48} thickness={5} />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        {!isEditMode && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={2}
            justifyContent="flex-start"
          >
            <Button
              variant="outlined"
              color="primary"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                fontWeight: 500,
                boxShadow: "0px 2px 8px 0px #4f8ad20f",
                transition: "background .2s, color .2s",
                "&:hover": {
                  background:
                    "linear-gradient(90deg,#60a5fa90 0%, #a7f3d0 80%)",
                  color: "#1e3a8a",
                },
              }}
            >
              Upload Audio
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <IconButton
              color={isRecording ? "error" : "primary"}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              aria-label={isRecording ? "Stop Recording" : "Start Recording"}
              sx={{
                background: isRecording
                  ? "linear-gradient(60deg,#fbc2eb,#f6d365)"
                  : "linear-gradient(60deg,#b2fefa,#fcdeff)",
                color: isRecording ? "#b91c1c" : "#1e3a8a",
                borderRadius: "50%",
                boxShadow: isRecording
                  ? "0 0 0 4px #f1f5f980"
                  : "0 2px 8px 0 #c4b5fd37",
                p: 2,
                transition: "all .18s",
                fontSize: "2rem",
                "&:hover": {
                  background: isRecording ? "#f8717180" : "#a7f3d080",
                  color: "#2e1065",
                },
              }}
            >
              {isRecording ? (
                <MicOffIcon sx={{ fontSize: 20 }} />
              ) : (
                <MicIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Stack>
        )}
        {!isEditMode && (
          <Box sx={{ minHeight: 18 }}>
            {audioFile && (
              <Typography variant="body2" color="info.main">
                Selected File:{" "}
                <span style={{ fontWeight: 600 }}>{audioFile.name}</span>
              </Typography>
            )}
            {isRecording && (
              <Typography variant="body2" color="error">
                ● Recording...
              </Typography>
            )}
          </Box>
        )}

        {/* Audio Playback */}
        {audioURL && (
          <Box sx={{ mt: 1 }}>
            <audio controls style={{ width: "100%" }} src={audioURL} />
          </Box>
        )}

        {/* Transcript Field */}
        {isEditMode ? (
          <TextField
            label="Transcript"
            multiline
            fullWidth
            minRows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcribed or manual notes..."
            InputProps={{
              sx: {
                background: "#f1f5fb",
                borderRadius: 2,
                fontSize: "1rem",
              },
            }}
            sx={{
              boxShadow: "0 1px 6px 0 #9bbcf61a",
            }}
          />
        ) : null}

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 5,
              fontWeight: 700,
              letterSpacing: 2,
              boxShadow: "0 4px 20px 0 #22c55e29",
              background: "linear-gradient(90deg,#4ade80 0%,#38bdf8 100%)",
              color: "#fff",
              transition: "all .18s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 160,
              "&:hover": {
                background: "linear-gradient(90deg,#38bdf8 0%,#4ade80 100%)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={28}
                thickness={5}
                sx={{ color: "white" }}
              />
            ) : isEditMode ? (
              "Update Note"
            ) : (
              "Create & Transcribe"
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NoteForm;
