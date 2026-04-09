import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { generateBuddyResponse } from '../utils/api/openai';
import { clearStoredUserData, getStoredUserData } from '../utils/storage.js';

const Chatbot = () => {
    const navigate = useNavigate();
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', message: 'Hello, how can I assist you today?' }
    ]);
    const [userInput, setUserInput] = useState('');

    const parsedUserData = getStoredUserData();
    const mental_health_data = parsedUserData?.mental_health_data;

    const handleUserInput = async () => {
        if (userInput.trim() === '') return;
    
        // Add user's message to the chat history
        const userMessage = { sender: 'user', message: userInput };
        setChatHistory((prev) => [...prev, userMessage]);
    
        // Clear the input field
        setUserInput('');
    
        // Show a temporary bot message for "typing"
        const typingMessage = { sender: 'bot', message: 'Typing...' };
        setChatHistory((prev) => [...prev, typingMessage]);
    
        try {
            // Await the API response
            const response = await generateBuddyResponse(userInput, mental_health_data);
    
            // Remove the "typing" message and add the actual response
            setChatHistory((prev) => {
                const updatedChat = [...prev];
                updatedChat.pop(); // Remove "Typing..." message
                updatedChat.push({ sender: 'bot', message: response.response || 'I am here to help.' });
                return updatedChat;
            });
        } catch (err) {
            console.error(err);
    
            // Handle errors with a fallback bot message
            setChatHistory((prev) => {
                const updatedChat = [...prev];
                updatedChat.pop(); // Remove "Typing..." message
                updatedChat.push({ sender: 'bot', message: 'Sorry, something went wrong. Please try again later.' });
                return updatedChat;
            });
        }
    };
    

    const handleSignOut = () => {
        clearStoredUserData();
        navigate('/');
    };

    if (!mental_health_data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-mint via-mint to-dimGrey flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                    <p className="mb-4">Please log in to use the Mentally assistant.</p>
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-mint via-mint to-dimGrey flex flex-col items-center">
            {/* Navbar */}
            <div className="w-full bg-white p-4 flex justify-between items-center shadow-lg">
                <div className="text-2xl text-center font-semibold">
                    {/* You can add a logo or title here */}
                </div>
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faSignOutAlt} className="cursor-pointer" onClick={handleSignOut} />
                    <Link to="/account">Dashboard</Link>
                </div>
            </div>

            {/* Chatbot Container */}
            <div className="flex-1 w-full max-w-3xl p-8 bg-gray-800 rounded-lg shadow-xl flex flex-col mt-8">
                {/* Chat Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-white">Mentally Assistant</h2>
                </div>

                {/* Chat Window */}
                <div className="flex-1 overflow-y-auto bg-gray-700 rounded-lg p-4 space-y-4 max-h-[75vh]">
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex items-start space-x-4 ${
                                chat.sender === 'user' ? 'justify-end' : ''
                            }`}
                        >
                            <div
                                className={`${
                                    chat.sender === 'user' ? 'bg-darkBlue' : 'bg-dimGrey'
                                } text-white p-3 rounded-lg max-w-xs`}
                            >
                                <p>{chat.message}</p>
                            </div>
                        </div>
                    ))}
                </div>


                {/* User Input Area */}
                <div className="flex items-center space-x-4 mt-4">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full p-3 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUserInput();
                        }}
                    />
                    <button
                        className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 focus:outline-none"
                        onClick={handleUserInput}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
