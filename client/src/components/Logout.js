import React from 'react';

const Logout = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                method: 'GET',
                credentials: 'include', // Ensures cookies are included in the request
            });

            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            } else {
                console.error('Failed to log out:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className='flex items-center justify-center m-5 flex-wrap flex-col'>
            <span className='text-xl'>Are you sure?</span>
            <button 
                onClick={handleLogout}
                className='bg-red-600 px-3 py-1 text-white rounded-lg m-2 hover:bg-red-700 transition'>
                Logout
            </button>
        </div>
    );
};

export default Logout;
