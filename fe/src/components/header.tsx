import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode"; // Moon Icon
import LightModeIcon from "@mui/icons-material/LightMode"; // Sun Icon
import logo from "../assets/images/Blog.png";
import CustomModal from "./modal";
import { useNavigate } from "react-router-dom";
import ROUTES from "../utils/routes";
import { ThemeContext } from "../context/themeContext"; // Import Theme Context

const Header = () => {
  const theme = useTheme();
  const { toggleTheme, darkMode } = useContext(ThemeContext); // Get theme state from context
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (link: string) => {
    if (link === "LOGIN") {
      setModalOpen(true);
    } else if (link === "LOGOUT") {
      setData(null);
      localStorage.clear();
      navigate("/");
    } else if (link === "Create BLog") {
      navigate(ROUTES.CREATEBLOG);
    } else if (link === "My Blogs") {
      navigate(ROUTES.POSTLIST);
    } else if (link === "All Posts") {
      navigate(ROUTES.ALLPOST);
    }
    handleMenuClose();
  };

  const navLinks =
    data || localStorage.getItem("token")
      ? ["My Blogs", "Create BLog", "LOGOUT", "All Posts"]
      : ["LOGIN", "All Posts"];
  const email = localStorage.getItem("email");

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default, p: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FF9800" }}>
            BLOGS
          </Typography>
        </Box>

        {email && (
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Hi, {email}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ "& .MuiPaper-root": { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary } }}
              >
                {navLinks.map((link) => (
                  <MenuItem key={link} onClick={() => handleNavClick(link)}>
                    {link}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  sx={{ color: theme.palette.text.primary, fontWeight: "bold", textTransform: "none", "&:hover": { color: "#FF9800" } }}
                >
                  {link}
                </Button>
              ))}
            </Box>
          )}

          {/* Theme Toggle Button (Moon for Night Mode, Sun for Day Mode) */}
          <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
            {darkMode ? <LightModeIcon sx={{ color: "#FFC107" }} /> : <DarkModeIcon sx={{ color: "#FF9800" }} />}
          </IconButton>
        </Box>
      </Toolbar>
      <CustomModal setToken={setData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppBar>
  );
};

export default Header;
