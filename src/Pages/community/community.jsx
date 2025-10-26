import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  ThumbsUp,
  Send,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import config from "../../config";

export default function TwitterLikeCommunityPage() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [user, setUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
  const scrollRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchRandomUsers();
    if (token) {
      fetchUserData();
    }
    checkDisclaimerStatus();
  }, [token]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [posts]);


const checkDisclaimerStatus = () => {
    const lastShown = localStorage.getItem('disclaimerLastShown');
    const today = new Date().toDateString();
    
    if (!lastShown || lastShown !== today) {
      setShowDisclaimer(true);
      localStorage.setItem('disclaimerLastShown', today);
    }
  };

  const closeDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/posts`);
      setPosts(response.data);
      response.data.forEach((post) => fetchComments(post._id));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/posts/${postId}/comments`
      );
      setComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  // const fetchRandomUsers = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${config.API_BASE_URL}/users/random?limit=3`
  //     );
  //     setRandomUsers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching random users:", error);
  //   }
  // };
  
  const fetchRandomUsers = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/users/random?limit=3`
      );
      // Filter out the current user from random users
      const filteredUsers = response.data.filter(randomUser => randomUser._id !== user?._id);
      setRandomUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching random users:", error);
    }
  };

  const addNewPost = async () => {
    if (!token) {
      alert("Please log in to post.");
      return;
    }
    if (newPostContent.trim() === "") return;
    try {
      await axios.post(
        `${config.API_BASE_URL}/posts`,
        { content: newPostContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding new post:", error);
    }
  };

  const toggleLike = async (postId) => {
    if (!token) {
      alert("Please log in to like posts.");
      return;
    }
    try {
      await axios.post(
        `${config.API_BASE_URL}/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const addComment = async (postId) => {
    if (!token) {
      alert("Please log in to comment.");
      return;
    }
    if (newComments[postId]?.trim() === "") return;
    try {
      await axios.post(
        `${config.API_BASE_URL}/posts/${postId}/comments`,
        { content: newComments[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const followUser = async (userId) => {

  //   if (!token) {
  //     alert("Please log in to follow users.");
  //     return;
  //   }
  //   try {
  //     await axios.post(
  //       `${config.API_BASE_URL}/users/${userId}/follow`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     fetchRandomUsers();
  //     if (selectedUser && selectedUser._id === userId) {
  //       setSelectedUser((prev) => ({
  //         ...prev,
  //         followers: [...prev.followers, user._id],
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error following user:", error);
  //   }
  // };


  const followUser = async (userId) => {
    if (!token) {
      alert("Please log in to follow users.");
      return;
    }
    try {
      await axios.post(
        `${config.API_BASE_URL}/users/${userId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRandomUsers();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), user._id],
        }));
      }
      // Update the user's following list
      setUser((prevUser) => ({
        ...prevUser,
        following: [...(prevUser.following || []), userId],
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const showUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/users/${userId}`
      );
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const searchUsers = async () => {
    if (searchQuery.trim() === "") return;
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/users/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
<AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <Card className="w-full max-w-md bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mr-4" />
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Disclaimer: This community is for study purposes only. Please do not post any sensitive or personal information.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeDisclaimer}
                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-6xl mx-auto flex">
   
        <div className="w-2/3 pr-4">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Community Feed
          </h1>
          {token ? (
            <Card className="mb-4 p-4 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.imageUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <Input
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's happening?"
                  className="flex-grow"
                />
              </div>
              <Button
                onClick={addNewPost}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Post
              </Button>
            </Card>
          ) : (
            <Card className="mb-4 p-4 bg-white dark:bg-gray-800">
              <p className="text-center text-gray-700 dark:text-gray-300">
                Please log in to create posts, like content, and comment.
              </p>
            </Card>
          )}
          <div
            ref={scrollRef}
            className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]"
          >
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-4 mb-2">
                        <Avatar
                          className="h-10 w-10 cursor-pointer"
                          onClick={() => showUserProfile(post.author._id)}
                        >
                          <AvatarImage
                            src={post.author.imageUrl}
                            alt={post.author.name}
                          />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className="font-semibold text-gray-900 dark:text-white cursor-pointer"
                            onClick={() => showUserProfile(post.author._id)}
                          >
                            {post.author.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {post.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          token
                            ? toggleLike(post._id)
                            : alert("Please log in to like posts.")
                        }
                        className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                          post.likes.includes(user?._id)
                            ? "text-blue-600 dark:text-blue-400"
                            : ""
                        }`}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {post.likes.length} Likes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedPost(
                            expandedPost === post._id ? null : post._id
                          )
                        }
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {comments[post._id]?.length || 0} Comments
                        {expandedPost === post._id ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </CardFooter>
                    <AnimatePresence>
                      {expandedPost === post._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                            {comments[post._id]?.map((comment) => (
                              <div
                                key={comment._id}
                                className="mt-2 p-3 bg-white dark:bg-gray-600 rounded-md shadow"
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={comment.author.imageUrl}
                                      alt={comment.author.name}
                                    />
                                    <AvatarFallback>
                                      {comment.author.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {comment.author.name}
                                  </p>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                            {token ? (
                              <div className="mt-4 flex items-center">
                                <Input
                                  placeholder="Add a comment..."
                                  value={newComments[post._id] || ""}
                                  onChange={(e) =>
                                    setNewComments({
                                      ...newComments,
                                      [post._id]: e.target.value,
                                    })
                                  }
                                  className="flex-grow mr-2"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => addComment(post._id)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
                                Log in to comment
                              </p>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-1/3 pl-4">
          {selectedUser ? (
            <Card className="bg-white dark:bg-gray-800 mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-4 mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedUser.imageUrl}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-xl text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {selectedUser.bio}
                </p>
                <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{selectedUser.followers.length} Followers</span>
                  <span>{selectedUser.following.length} Following</span>
                </div>
                {user && user._id !== selectedUser._id && (
                  <Button
                    onClick={() => followUser(selectedUser._id)}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={user && selectedUser.followers.includes(user._id)}
                  >
                    {user && selectedUser.followers.includes(user._id)
                      ? "Following"
                      : "Follow"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-white dark:bg-gray-800 mb-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Find Users
                  </h2>
                  <div className="flex mb-4">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow mr-2"
                    />
                    <Button
                      onClick={searchUsers}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Search Results
                      </h3>
                      {searchResults.map((searchUser) => (
                        <div
                          key={searchUser._id}
                          className="flex items-center justify-between mb-2"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={searchUser.imageUrl}
                                alt={searchUser.name}
                              />
                              <AvatarFallback>
                                {searchUser.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                {searchUser.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                @{searchUser.username}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => followUser(searchUser._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={
                              user && searchUser.followers.includes(user._id)
                            }
                          >
                            {user && searchUser.followers.includes(user._id)
                              ? "Following"
                              : "Follow"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* <Card className="bg-white dark:bg-gray-800 mb-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Who to follow
                  </h2>
                  {randomUsers.map((randomUser) => (
                    <div
                      key={randomUser._id}
                      className="flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={randomUser.imageUrl}
                            alt={randomUser.name}
                          />
                          <AvatarFallback>{randomUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {randomUser.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{randomUser.username}
                          </p>
                        </div>
                      </div>
                      {/* <Button
                        size="sm"
                        onClick={() => followUser(randomUser._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={user && randomUser.followers.includes(user._id)}
                      >
                        {user && randomUser.followers.includes(user._id) ? (
                          <span>Following</span>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button> */}
                      {/* <Button
                        size="sm"
                        onClick={() => followUser(randomUser._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={
                          user &&
                          randomUser.followers &&
                          randomUser.followers.includes(user._id)
                        }
                      >
                        {user &&
                        randomUser.followers &&
                        randomUser.followers.includes(user._id) ? (
                          <span>Following</span>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card> */} 
              <Card className="bg-white dark:bg-gray-800 mb-4">
              <CardContent className="pt-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Who to follow
                </h2>
                {randomUsers.map((randomUser) => (
                  <div
                    key={randomUser._id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={randomUser.imageUrl}
                          alt={randomUser.name}
                        />
                        <AvatarFallback>{randomUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {randomUser.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{randomUser.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => followUser(randomUser._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={user?.following?.includes(randomUser._id)}
                    >
                      {user?.following?.includes(randomUser._id) ? (
                        <span>Following</span>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
