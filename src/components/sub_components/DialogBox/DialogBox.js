import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "./DialogBox.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DialogBox = ({
  title,
  children,
  showDialog,
  onAcceptCallback,
  onCloseCallback,
}) => {
  return (
    <div className="dialog-box-container">
      <BootstrapDialog
        onClose={onCloseCallback}
        aria-labelledby="customized-dialog-title"
        open={showDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onCloseCallback}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {children.map(([title, value], index) => {
            return (
              <Typography
                gutterBottom
                className="dialog-box-content"
                sx={{
                    fontSize: "1.5rem",
                }}
                key={(index + 1) * 2 + Date.now()}
              >
                <span style={{ fontWeight: "500" }}>{title}:</span> {value}
              </Typography>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onAcceptCallback}>
            Accept
          </Button>
          <Button autoFocus onClick={onCloseCallback}>
            Back
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default DialogBox;
