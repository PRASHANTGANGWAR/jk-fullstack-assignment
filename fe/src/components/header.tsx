import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "../assets/images/Blog.png";
import CustomModal from "./modal";
import { useNavigate } from "react-router-dom";
import ROUTES from "../utils/routes";

const Header = () => {
  const theme = useTheme();
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
      // setData(null);
      localStorage.clear();
    } else if (link === "Create BLog") {
      navigate(ROUTES.CREATEBLOG);
    } else if (link === "My Blogs") {
      navigate(ROUTES.POSTLIST); // ranme routes in main file
    }
    handleMenuClose();
  };
  console.log(data, 'dataaaa')
  const navLinks = data || localStorage.getItem('token')
    ? ["My Blogs", "Create BLog", "LOGOUT"]
    : ["LOGIN"];
  const email = localStorage.getItem("email");

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#3a4237", p: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              onClick={() => navigate("/")}
              src={logo}
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <Typography
              variant={isMobile ? "h5" : "h3"}
              sx={{ fontWeight: "bold", color: "#9b6a3e" }}
            >
              BLOGGER
            </Typography>
          </Box>
          {email && <Typography> Hi, {email}</Typography>}
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {navLinks.map((link) => (
                  <MenuItem key={link} onClick={() => handleNavClick(link)}>
                    {link}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 3 }}>
              {navLinks.map((link) => (
                <Typography
                  key={link}
                  variant="body1"
                  onClick={() => handleNavClick(link)}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    "&:hover": { color: "#9b6a3e" },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <CustomModal
        setToken={setData}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Header;
