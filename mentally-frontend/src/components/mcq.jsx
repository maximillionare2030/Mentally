import React from 'react';
import { useEffect, useState} from 'react';
import {sleep, typeText} from "../utils/util.js";

function MCQ({ className, question }) {

    const [prompt, setPrompt] = useState('');

    return (
        <div className={`text-center ${className}`}> {/* Merge external classes */}
            <h2>{question}</h2>
        </div>
    );
}

export default MCQ;