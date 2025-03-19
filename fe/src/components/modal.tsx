import * as React from "react"; // ✅ Fix: Use named import
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
  setToken: (value: string | null) => void;  // rename func name
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, setToken }: CustomModalProps) => {
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
          maxWidth: 400,
          height: { xs: "auto", sm: 500 },
          bgcolor: "white",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={logo}
          alt="Login"
          style={{
            width: 200,
            height: 200,
            marginBottom: 16,
          }}
        />

        <Typography variant="h5" gutterBottom>
          Sign in to Continue
        </Typography>

        <a
          href={`${import.meta.env.VITE_API_URL}/google`}
          style={{
            display: "block",
            marginTop: "5px",
            width: "95%",
            textAlign: "center",
            backgroundColor: "#1976D2",
            color: "white",
            padding: "10px",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Sign in with Google
        </a>

        <Button variant="outlined" fullWidth onClick={onClose} sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
