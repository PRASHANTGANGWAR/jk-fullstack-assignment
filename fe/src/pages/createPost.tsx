import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../utils/routes";

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success" | "warning",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark"; // Detects current theme mode

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file.name });
    }
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("body", formData.body);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput.files?.[0]) {
      formDataToSend.append("image", fileInput.files[0]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Post created successfully!",
          severity: "success",
        });
        setTimeout(() => navigate(ROUTES.POSTLIST), 1000);
      } else {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Unauthorized! Please log in.",
            severity: "warning",
          });
        } else if (response.status === 500) {
          setSnackbar({
            open: true,
            message: "Server error. Please try again later.",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed, Creating post.",
            severity: "error",
          });
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while submitting.",
        severity: "error",
      });
    }
  };

  return (
    <Box mt={20}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "auto",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: isDarkMode ? "#333" : "#fff", 
          color: isDarkMode ? "#fff" : "#000", 
        }}
      >
        <Typography variant="h4" align="center">
          Create Blog
        </Typography>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: isDarkMode ? "white" : "black" },
              "&:hover fieldset": { borderColor: isDarkMode ? "gray" : "black" },
              "&.Mui-focused fieldset": { borderColor: isDarkMode ? "gray" : "black" },
              color: isDarkMode ? "white" : "black",
            },
          }}
        />
        <TextField
          label="Description"
          name="body"
          value={formData.body}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: isDarkMode ? "white" : "black" },
              "&:hover fieldset": { borderColor: isDarkMode ? "gray" : "black" },
              "&.Mui-focused fieldset": { borderColor: isDarkMode ? "gray" : "black" },
              color: isDarkMode ? "white" : "black",
            },
          }}
        />
        <Button
          sx={{
            background: isDarkMode ? "white" : "black",
            color: isDarkMode ? "black" : "white",
            "&:hover": {
              background: isDarkMode ? "#ddd" : "#333",
            },
          }}
          variant="contained"
          component="label"
        >
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>
        {formData.image && (
          <Typography variant="body2">Selected: {formData.image}</Typography>
        )}
        <Button
          sx={{
            background: isDarkMode ? "white" : "black",
            color: isDarkMode ? "black" : "white",
            "&:hover": {
              background: isDarkMode ? "#ddd" : "#333",
            },
          }}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePost;
