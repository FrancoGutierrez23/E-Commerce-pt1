const fetchUserStatus = async (token) => {
  if (!token) {
    // If no token is found, there's no authenticated user.
    return Error("Please login/register first.");
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/status`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.isAuthenticated) {
      return data.user.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user status:", error);
    return null;
  }
};

export default fetchUserStatus;
