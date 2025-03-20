import React from "react";
import { Box, Typography, useMediaQuery,} from "@mui/material";

const Footer: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000000",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "center" : "start",
        textAlign: isMobile ? "center" : "left",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
 
      <Box sx={{ position: "relative", bottom: "10px", left: "50%", transform: "translateX(-50%)", width: "100%", textAlign: "center" }}>
        <Typography variant="body2">
          © footer.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
