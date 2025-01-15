import { createContext, useEffect, useState } from "react";
import bookmark from '../assets/bookmark.png';
import mark from '../assets/mark.png';
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  
  const [savelist, setSavelist] = useState(() => {
    const savedPosts = localStorage.getItem('savepost');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const getUser = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error('Error fetching user:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  const toggleSavePost = (post) => {
    const updatedSavelist = savelist.some((savepost) => savepost.id === post.id)
      ? savelist.filter((savepost) => savepost.id !== post.id)
      : [...savelist, post];

    setSavelist(updatedSavelist);
    localStorage.setItem('savepost', JSON.stringify(updatedSavelist));
  };

  const checkMark = (post) => {
    return savelist.some((savepost) => savepost.id === post.id) ? mark : bookmark;
  };

  const checkSavelistInPosts = () => {
    if (!posts || !savelist) return [];
    const reverse = savelist.filter((savedPost) => 
      posts.some((post) => post.id === savedPost.id)
    );
    return reverse.reverse()
  };

  const validSavelist = checkSavelistInPosts(); // Contains only the valid posts from savelist

  return (
    <AppContext.Provider value={{ 
      token, setToken, user, setUser, toggleSavePost, checkMark, 
      open, setOpen, slides, setSlides, validSavelist, loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
