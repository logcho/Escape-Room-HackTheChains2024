import React, { useState, useEffect } from "react";
import { Button, useToast, Select, Heading, resolveStyleConfig } from "@chakra-ui/react";
import { sendInput, sendInput2, inspect } from "./util";
import './CreateGame.css';

import Game1 from "./Game1"


const generateNumbers = (count) => {
    let numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(i, i); // Add pairs of numbers
    }
    numbers.sort(() => Math.random() - 0.5); // Shuffle the array
    return numbers;
};


    

    

function CreateGame({ signer }) {
    const [loading, setLoading] = useState(false);

    const [isActive, setIsActive] = useState(false);
    const [numbers, setNumbers] = useState(generateNumbers(7)); // Generate 4 pairs of numbers
    const toast = useToast();
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [seconds, setSeconds] = useState(30);
    const [score, set] = useState(0);
    useEffect(() => {
        if (seconds >= 0 && isActive) {
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
        await sendInput2(
            JSON.stringify({
                method: "createGame",
            }),
            signer,
            result,
            toast,
        );
    }

  

    async function handleSubmit2(event) {
      event.preventDefault();
      setIsActive(false);
      const gameResult = validateGame();
      let result = gameResult + 30 - seconds;
      await submitScore(result);
  }
  

    async function createGame() {
        await sendInput(
            JSON.stringify({
                method: "createGame",
            }),
            signer,
            toast
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        await createGame();
        setLoading(false);
        setIsActive(true)
        // Navigate to the game page
    }

    let buttonProps = {};
    if (loading) buttonProps.isLoading = true;

    return (
        
        <div className="gameForm">
            <form onSubmit={handleSubmit}>
                <Button {...buttonProps} type="submit" className="button">
                    Start
                </Button>
            </form>
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
            
                  <Button type="submit" className="button2" form onClick={handleSubmit2}>Submit</Button>



            </div>


            {/* <h2>{score}</h2> */}
        </div>
    );
}


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
      fontSize: 25,
    },
    matched: {
      backgroundColor: '#81C784',
    },
  };

export default CreateGame;