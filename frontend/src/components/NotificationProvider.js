import React from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";

const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  "& .SnackbarItem-root": {
    borderRadius: 12,
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.12)",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "14px 20px",
    maxWidth: 360,
    color: "#fff",
    letterSpacing: "0.03em",
    "&.SnackbarItem-variantSuccess": {
      backgroundColor: "#4caf50",
    },
    "&.SnackbarItem-variantError": {
      backgroundColor: "#f44336",
    },
    "&.SnackbarItem-variantWarning": {
      backgroundColor: "#ff9800",
    },
    "&.SnackbarItem-variantInfo": {
      backgroundColor: "#2196f3",
    },
  },
}));

export const useNotify = () => useSnackbar();

const NotificationProvider = ({ children }) => {
  return (
    <StyledSnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3500}
      TransitionComponent={Slide}
      dense
    >
      {children}
    </StyledSnackbarProvider>
  );
};

export default NotificationProvider;
