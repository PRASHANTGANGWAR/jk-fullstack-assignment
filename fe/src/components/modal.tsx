import * as React from "react";
import { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../assets/images/Blog.png";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  setToken: (value: string | null) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, setToken }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      if (email) localStorage.setItem("email", email);
      setToken(token);
      navigate("/");
    }
  }, [token, email, setToken, navigate]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          maxWidth: 420,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={logo}
          alt="Login"
          style={{ width: 180, height: 180, marginBottom: 16 }}
        />

        <Typography variant="h5" fontWeight={600} gutterBottom>
          Sign in to Continue
        </Typography>

        <a
          href={`${import.meta.env.VITE_API_URL}/google`}
          style={{
            display: "block",
            marginTop: "12px",
            width: "100%",
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            padding: "12px",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Sign in with Google
        </a>

        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          sx={{
            mt: 2,
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;