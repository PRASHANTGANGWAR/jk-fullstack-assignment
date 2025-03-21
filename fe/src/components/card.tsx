import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardMedia, Typography, Box, Button, Grid2 } from "@mui/material";
import ROUTES from "../utils/routes";

type CardData = {
  image: string;
  title: string;
  body: string;
  createdAt: string; 
};

interface CardGridProps {
  posts: CardData[];
  title:string
}

const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const HoverCard: React.FC<CardData> = ({ image, title, body, createdAt }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(ROUTES.POSTDETAIL, { state: { image, title, body, createdAt } });
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        width: "80%",
        padding: 8,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#F5F9FC",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <CardMedia
          component="img"
          image={`${import.meta.env.VITE_API_URL}/${image}`}
          alt={title}
          sx={{
            width: "100%",
            maxWidth: 250,
            height: 250,
            objectFit: "contain",
            borderRadius: 2,
            border: "5px solid white",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        />
      </Box>

      <Box sx={{ flex: 2, paddingLeft: 3 }}>
        <Typography variant="h5" fontWeight="medium" color="#000000" mb={1}>
          Published on: {new Date(createdAt).toLocaleDateString()}
        </Typography>
        
        <Typography variant="h5" fontWeight="bold" color="#333">
          {title.split(" ").slice(0, -1).join(" ")} {" "}
          <i style={{ color: "#333" }}>{title.split(" ").slice(-1)}</i>
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#555",
            marginTop: 1,
            lineHeight: 1.6,
          }}
        >
          {truncateText(body, 120)}
        </Typography>

        <Button
          onClick={handleCardClick}
          variant="contained"
          sx={{
            marginTop: 2,
            backgroundColor: "#000000",
            color: "#ffffff",
            textTransform: "none",
            borderRadius: 20,
            padding: "6px 16px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Continue Reading →
        </Button>
      </Box>
    </Card>
  );
};

const CardGrid: React.FC<CardGridProps> = ({ posts ,title }) => {
  return (
    <Box mt={4} mb={4} textAlign="center">
      <Typography variant="h4" fontWeight="bold" mb={3} color="#00000">
        {title}
      </Typography>
      <Grid2 container spacing={4} justifyContent="center">
        {posts?.map((card: CardData, index: number) => (
          <Grid2  key={index} size = {{xs:12,md:6}} >
            <HoverCard {...card} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default CardGrid;