import React, { useState, useEffect } from 'react';
import { Button, useToast, Select, Heading } from "@chakra-ui/react";
import { sendInput } from "./util";


const generateNumbers = (count) => {
    let numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(i, i); // Add pairs of numbers
    }
    numbers.sort(() => Math.random() - 0.5); // Shuffle the array
    return numbers;
};

export default function Game1({ signer }){
    const [numbers, setNumbers] = useState(generateNumbers(6)); // Generate 4 pairs of numbers
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [seconds, setSeconds] = useState(30);
    const [isActive, setIsActive] = useState(true);
    const toast = useToast();

    useEffect(() => {
        if (seconds > 0 && isActive) {
          const interval = setInterval(() => {
            setSeconds(s => s - 1);
          }, 1000);
          return () => clearInterval(interval);
        } else if (seconds === 0) {
          setIsActive(false);
          alert("Time's up! Game over!");
        }
    }, [seconds, isActive]);

    const selectNumber = (index) => {
        if (!isActive || selectedIndices.length === 2 || selectedIndices.includes(index) || matchedPairs.includes(index)) {
          return;
        }
    
        const newSelectedIndices = [...selectedIndices, index];
        setSelectedIndices(newSelectedIndices);
    
        if (newSelectedIndices.length === 2) {
          const match = numbers[newSelectedIndices[0]] === numbers[newSelectedIndices[1]];
          if (match) {
            setMatchedPairs([...matchedPairs, ...newSelectedIndices]);
          }
          setTimeout(() => setSelectedIndices([]), 500);
        }
    };

    const isMatched = (index) => matchedPairs.includes(index);

    const validateGame = () => {
      return matchedPairs.length === numbers.length / 2;
    };

    async function submitScore(result) {
        await sendInput(
            JSON.stringify({
                method: "updateScore",
            }),
            signer,
            result,
            toast
        );
    }
    const handleSubmit2 = async () => {
        setIsActive(false);
        const gameResult = validateGame();
        let result = gameResult + 30 - seconds;
        await submitScore(result);
    };  

    return(
        <div style={styles.container}>
            <div style={styles.timer}>Time left: {seconds}s</div>
            <div style={styles.grid}>
                {numbers.map((number, index) => (
                <button
                    key={index}
                    style={{...styles.number, ...(isMatched(index) ? styles.matched : null)}}
                    onClick={() => selectNumber(index)}
                    disabled={!isActive || isMatched(index)}
                >
                    {selectedIndices.includes(index) || isMatched(index) ? number : '?'}
                </button>
                ))}
            </div>
            {isActive && <button onClick={handleSubmit2}>Submit</button>}
        </div>
    );
};
const styles = {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    timer: {
      fontSize: 24,
      marginBottom: 20,
    },
    grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    number: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      backgroundColor: '#64B5F6',
      borderRadius: 5,
      border: 'none',
      cursor: 'pointer',
    },
    matched: {
      backgroundColor: '#81C784',
    },
  };