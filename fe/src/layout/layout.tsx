import { Outlet } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100vw"
      height="100vh"
      sx={{ overflow: "hidden" }}
    >
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </Box>

      <Box
        component="main"
        flexGrow={1}
        sx={{
          overflowY: "auto",
          marginTop: "80px",
          paddingBottom: "50px",
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
