import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const PostDetail = () => {
  const location = useLocation();
  const { image, title, body } = location.state || {};

  if (!title) {
    return <Typography variant="h6">No Post Found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ width: "100%", height: "300px", overflow: "hidden" }}>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain", 
            }}
            image={`${import.meta.env.VITE_API_URL}/${image}`}
            alt="Post Image"
          />
        </Box>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {body}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostDetail;
