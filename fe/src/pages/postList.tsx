import { useEffect, useState } from 'react';
import CardGrid from '../components/card';
import { Box, Typography, Snackbar, Alert } from '@mui/material';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setStatusCode(response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data.length === 0) {
          setError('No posts found');
          setOpenSnackbar(true);
          return;
        }

        setPosts(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          setOpenSnackbar(true);
        } else {
          setError('An unknown error occurred');
          setOpenSnackbar(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box px={{ xs: 2, sm: 4, md: 8 }}>
      {error && (
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={statusCode === 401 ? 'warning' : 'error'}>
            {statusCode === 401
              ? 'Unauthorized access. Please log in.'
              : statusCode === 500
              ? 'Server error. Please try again later.'
              : error}
          </Alert>
        </Snackbar>
      )}
      <CardGrid posts={posts} />
    </Box>
  );
};

export default PostList;
