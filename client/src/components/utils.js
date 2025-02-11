const fetchUserStatus = async (userId, setUserId, token) => {
    if (!token) {
        // If no token is found, there's no authenticated user.
        setUserId(null);
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/status`, {
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.isAuthenticated){
            setUserId(data.user.id);
            return true;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user status:', error);
    }
};

export default fetchUserStatus;