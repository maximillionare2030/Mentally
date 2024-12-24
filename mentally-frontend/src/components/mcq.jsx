import React, { useState, useEffect } from "react";
import { sleep } from "../utils/util.js";

function MCQ({ className, question, responses, onResponseSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(null);  // Track selected index locally

  const handleSelect = (index) => {
    setSelectedIndex(index);  // Update local state when an option is selected
    onResponseSelect(index);   // Pass the selected index up to the parent
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedIndex(null);
    }, 100); // Delay in milliseconds
    
    return () => clearTimeout(timer);
  }, [selectedIndex]); 
  
  
  

  return (
    <div className={`text-center ${className}`}>
      {/* Display the question with fixed font size */}
      <div className="mb-8" style={{ height: "50%" }}>
        <h2 className="text-base font-semibold">{question}</h2>
      </div>

      {/* Display responses in a row with fixed font size and spacing */}
      <div className="flex flex-row justify-between items-center" style={{ height: "50%" }}>
        {responses.map((response, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between w-full"
            style={{ height: "25%" }}
          >
            {/* response text with fixed font size */}
            <p className="text-xs font-medium mb-4">{response}</p>

            {/* Circular button with selected state */}
            <button
              onClick={() => handleSelect(index)}  // Pass index to the handleSelect function
              className={`w-12 h-12 rounded-full border-4 ${
                selectedIndex === index
                  ? "bg-white border-lavendar"
                  : "bg-mint border-lavendar"
              } flex items-center justify-center text-white font-medium hover:scale-110 transition-transform duration-300`}
            >
              {selectedIndex === index ? "✔️" : ""}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MCQ;
