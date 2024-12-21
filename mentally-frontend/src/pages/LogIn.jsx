import React, { useState, useEffect } from 'react';
import { logIn, getUserData } from "../utils/api/user_auth.js";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


const LogInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpStatus, setSignUpStatus] = useState('');

    const navigate = useNavigate();
    

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const message = await logIn(email, password);
            setSignUpStatus(message);
    
            // After successful login, save the user data to localStorage
            if (message.message) {
                const userData = await getUserData(message.token);
                localStorage.setItem('userData', JSON.stringify(userData)); // Save to localStorage
    
                // Navigate to /account page
                navigate('/account', { state: { userData } });
            }
        } catch (error) {
            setSignUpStatus("Error signing up: " + error.message);
        }
    };
    

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
              <div className="flex flex-col items-center justify-center mt-8 bg-white w-1/2 p-4 border-2 rounded-xl">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Log in to Mentally
                        </h2>
                        <div className="w-full max-w-md">
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                               
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                    onClick={handleLogIn}
                                >
                                    Sign In
                                </button>
                            </form>
                        </div>
                        <p className="text-gray-600 text-sm mt-4">
                            Don't have have an account?{" "}
                            <a 
                            href="/signup" 
                            className="text-blue-500 hover:underline"
                            >
                                Sign Up
                            </a>
                        </p>
                    </div>
        </div>
    )

}


export default LogInForm;