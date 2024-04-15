import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    // State variables
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [bestScore, setBestScore] = React.useState(
    localStorage.getItem("bestScore") || 0
  );

    // Effect to check for tenzies and update best score
  React.useEffect(() => {
      // Check if all dice are held and have the same value
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      // Check if the current count is better than the bestScore
      if (count < bestScore || bestScore === 0) {
        setBestScore(count);
        // Save bestScore to localStorage
        localStorage.setItem("bestScore", count);
      }
    }
  }, [dice, count, bestScore]);

     // Function to generate a new die object
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    // Function to generate an array of new dice
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    // Function to roll the dice
    function rollDice() {
    let newCount = count;
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      newCount++;
      setCount(newCount);
    } else {
        // If tenzies, start a new game
      setTenzies(false);
      setDice(allNewDice());
      setCount(0);
    }
  }

    // Function to toggle holding a die
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    // Map dice state to Die components
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            Count: {count} || Best Score: {bestScore}
        </main>
    )
}
