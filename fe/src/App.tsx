import { useRoutes } from "react-router-dom";
import ImageCarousel from "./components/imageCarousel";
import Layout from "./layout/layout";
import PostList from "./pages/postList";
import PostDetail from "./pages/postDetail";
import ROUTES from "./utils/routes";
import CreatePost from "./pages/createPost";
import AllPostList from "./pages/allPost";

function App() {  
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: (
            <>
              <ImageCarousel />
            </>
          ),
        },
        {
          path: ROUTES.CREATEBLOG, /// rename all routes
          element: <CreatePost />,
        },

        {
          path: ROUTES.POSTLIST,
          element: <PostList />,
        },
        {
          path: ROUTES.POSTDETAIL,
          element: <PostDetail />,
        },
        {
          path:ROUTES.ALLPOST,
          element:<AllPostList/>
        }
      ],
    },
  ]);

  return routes;
}

export default App;
