import { useState, useEffect, useRef } from 'react';
import { generate } from 'random-words';
import wordHelpers from '../../../utils/wordUtils';
import EndGame from "./EndGame";


const StartGame = () => {

    const [wordsCount, setWordsCount] = useState([]);
    const [countdown, setCountdown] = useState(15);
    const [currentInputValue, setCurrentInputValue] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [correctWord, setCorrectWord] = useState(0);
    const [incorrentWord, setIncorrectWord] = useState(0);
    const [statusGame, setStatusGame] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [currCharIndex, setCurrCharIndex] = useState(-1);
    const [currChar, setCurrChar] = useState('')
    const [selectedTime, setSelectedTime] = useState(15);


    const textInput = useRef(null);
    const intervalRef = useRef();


    useEffect(() => {
        setWordsCount(generateRandomWords());
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            setStatusGame(true);
        }
    }, [countdown]);

    useEffect(() => {
        if (statusGame === false) {
            textInput.current.focus();
        }
    }, [statusGame]);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);


    function generateRandomWords() {
        const words = new Array(wordHelpers.NUMBER_OF_WORDS).fill(null).map(() => generate());

        return words;
    };

    function startTimerCountdown() {
        intervalRef.current = setInterval(() => {
            setCountdown((lastSecondCount) => {
                if (lastSecondCount === 0) {
                    clearInterval(intervalRef.current);
                } else {
                    return lastSecondCount - 1;
                }
            });
        }, 1000);
    };

    function handleTimeChange(e) {
        const selectedTime = parseInt(e.target.value, 10);
        setSelectedTime(selectedTime);
        setCountdown(selectedTime);
    }


    function handleLetterTyping({ keyCode, key }) {
        if (keyCode === 32) {
            checkMatchingWords();
            setCurrentInputValue('')
            setWordIndex(wordIndex + 1);
            setCurrCharIndex(-1);
        } else if (keyCode === 8) {
            setCurrCharIndex(currCharIndex - 1);
            setCurrChar('')
        } else {
            setCurrCharIndex(currCharIndex + 1);
            setCurrChar(key);
        };
    };

    function checkMatchingWords() {
        const word = wordsCount[wordIndex];
        const match = word === currentInputValue.trim();

        if (match) {
            setCorrectWord(correctWord + 1);
        } else {
            setIncorrectWord(incorrentWord + 1);
        };
    };

    function inputTypingValue(e) {

        if (!inputFocused) {
            setInputFocused(true);
            startTimerCountdown();
        };

        setCurrentInputValue(e.target.value);
    };

    function getCharClass(word, wordIdx, charIndex, char) {

        const correctWord = wordIdx === wordIndex && charIndex === currCharIndex && currChar && !statusGame;

        if (correctWord) {

            if (char === currChar) {
                return 'border-r-2 border-amber-200 text-black'
            } else {
                return 'text-red-500'
            }
        }  else if (wordIdx === wordIndex && currCharIndex <= wordsCount[wordIndex].length) {
            return 'text-[#D1D0C5]'
        } else if (wordIdx === wordIndex && currCharIndex > wordsCount[wordIndex].length) {
            return 'bg-red-300'
        } else {
            return '';
        };
    };

    function refreshWords() {
        setWordsCount(generateRandomWords());
        clearInterval(intervalRef.current);

        setCountdown(selectedTime);
        setCurrentInputValue('');
        setWordIndex(0);
        setCorrectWord(0);
        setIncorrectWord(0);
        setStatusGame(false);
        setInputFocused(false);
    }

    function retakeTest() {
        setCountdown(selectedTime);
        clearInterval(intervalRef.current);

        setCurrentInputValue('');
        setWordIndex(0);
        setCorrectWord(0);
        setIncorrectWord(0);
        setStatusGame(false);
        setInputFocused(false);
    }

    return (
        <div className="flex mt-[-112px] flex-col items-center justify-center h-screen bg-zinc-800">
            {!statusGame ? (
                <div className="text-center p-5 text-6xl text-[#D1D0C5]">
                    <h2>{countdown}</h2>
                </div>
            ) : null}

            {!statusGame ? (
               <div className='flex flex-row justify-end mr-[150px] mb-3 w-full pr-5'>
               <label htmlFor="timeSelect" className="text-[#D1D0C5] text-xl">
                   Select seconds:
               </label>
               <select
                   id="timeSelect"
                   className="ml-2  bg-zinc-800 text-amber-300 outline-none"
                   onChange={handleTimeChange}
                   value={selectedTime}
               >
                        <option value={10} className="text-[#D1D0C5]">10s</option>
                        <option value={15} className="text-[#D1D0C5]">15s</option>
                        <option value={30} className="text-[#D1D0C5]">30s</option>
               </select>
           </div>
            ) : null}
            <div className="mx-auto text-center px-[100px]">
                {!statusGame ? (
                    <div className="text-gray-500 text-3xl text-justify leading-2 line-clamp-3">
                        <div className="">
                            {wordsCount.map((word, i) => (
                                <span key={i}>
                                    <span className="">
                                        {word.split('').map((letter, index) => (
                                            <span className={getCharClass(word, i, index, letter)} key={index}>{letter}</span>
                                        ))}
                                    </span>
                                    <span> </span>
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}
                {!statusGame ? (
                    <div className="mt-4">
                        <button className="px-4 py-2" onClick={refreshWords}>
                            <i className='bx bx-refresh text-5xl text-[#D1D0C5] mt-5'></i>
                        </button>
                        <div className="mt-5">
                            <input
                                type="text"
                                ref={textInput}
                                className="w-[500px] h-[50px] focus:outline-none text-center text-3xl bg-zinc-800 text-zinc-200 border-b-2 border-ra"
                                onKeyDown={handleLetterTyping}
                                value={currentInputValue}
                                onChange={inputTypingValue}
                            />
                        </div>
                    </div>
                ) : null}

                {statusGame ? (
                    <EndGame
                        correctWord={correctWord}
                        incorrectWord={incorrentWord}
                        onRefresh={refreshWords}
                        onRetake={retakeTest}
                    />
                ) : null}
            </div>
        </div>
    );

}

export default StartGame;


