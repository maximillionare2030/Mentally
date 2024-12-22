import React, { useState, useEffect } from 'react';
import { logIn, getUserData } from "../utils/api/user_auth.js";
import { useNavigate, useLocation } from 'react-router-dom'; 


const LogInForm = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const PHQ_score = queryParams.get('PHQ_score');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpStatus, setSignUpStatus] = useState('');

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const response = await logIn(email, password);
    
            // Extract message or set a default message
            const message = response.message || "Unknown error";
            setSignUpStatus(message);
    
            if (response.token) {
                const userData = await getUserData(response.token);
                localStorage.setItem('userData', JSON.stringify(userData)); 
                navigate('/account', { state: { userData } });
            }
        } catch (error) {
            setSignUpStatus("Error logging in: " + error.message);
        }
    };
    

    // Check if the inputs are valid and disable the button accordingly
    const [isFormValid, setIsFormValid] = useState(false); // Track form validity

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordMinLength = 6;
        const isValid = emailRegex.test(email) && password.length >= passwordMinLength;
        setIsFormValid(isValid);
    }, [email, password]);

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
                        <p // Sign up status
                            className = "text-center">{signUpStatus}</p>
                        <button
                            type="submit"
                            className={`w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleLogIn}
                            disabled={!isFormValid} // Disable button if form is not valid 
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                    Don't have an account?{" "}
                    <a 
                    href="/signup" 
                    className="text-blue-500 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LogInForm;
