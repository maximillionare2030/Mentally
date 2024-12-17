import React, { useEffect, useState, useRef } from "react";
import MCQ from "../components/mcq.jsx";
import { sleep, typeText } from "../utils/util.js";

const Home = () => {
  const [message, setMessage] = useState("");
  const [MCQ_prompt, setMCQ] = useState(false);
  const welcomeRef = useRef(null);
  const MCQ_container = useRef(null);

  const welcome_msg = "Welcome to MENTALLY!";
  const welcome_msg2 = "How are you feeling today?";

  useEffect(() => {
    const runTypingSequence = async () => {
      await typeText(welcome_msg, setMessage);
      await sleep(1000);
      await typeText(welcome_msg2, setMessage);
      await sleep(1000);

      if (welcomeRef.current) {
        welcomeRef.current.classList.add("animate-fadeOutUp");

        // Wait for animation to finish and hide element
        welcomeRef.current.addEventListener("animationend", () => {
          welcomeRef.current.classList.add("hidden"); // Hide the element after animation

          // Ensure the DOM is updated before showing the MCQ
          setMCQ(true);
        });
      }
    };

    runTypingSequence();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-b from-darkBlue to-lightBlue flex flex-col gap-2 justify-center items-center">
      <div
        ref={welcomeRef}
        className="text-center bg-lightGrey opacity-70 border-2 border-lightGrey rounded-2xl p-20 w-3/4 h-1/8 animate-fadeInUp hover:scale-110 hover:opacity-80 transition-transform duration-500"
      >
        <h1>{message}</h1>
      </div>

      {MCQ_prompt && (
        <div
          ref={MCQ_container}
          className="text-center bg-lightGrey opacity-70 border-2 border-lightGrey rounded-2xl p-52 w-3/4 h-1/8 animate-fadeInUp hover:opacity-80 hover:scale-110 transition-transform duration-500"
        >
          <MCQ question="How are you?" />
        </div>
      )}
    </div>
  );
};

export default Home;