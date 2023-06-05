import { useCallback, useEffect, useState } from 'react';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// styles CSS
import './App.css';

//data
import {wordsList} from './data/words'

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'},
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  console.log(words)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories =Object.keys(words)
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]
      
      // pick a random word
      const word = 
        words[category][Math.floor(Math.random() * words[category].length)]

      console.log(category, word)

      return { category, word }
  }, [words])

  //starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    // chhoose a word
    const { category, word} = pickWordAndCategory()
   
    console.log(category, word)

    let wordLetters = word.split("")
    
    wordLetters = wordLetters.map((l) => l.toLowerCase())
    
    // console.log(category, word)
   
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters) 

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
  
  //process the leter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

       // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter) 
    ) {
      return
    }
    
    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        letter
      ])
    } else {
      setWrongLetters((actualWrongLetter) => [
        ...actualWrongLetter,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  console.log(wrongLetters)

  // restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }

  // clear letters state
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
        clearLetterStates()

        setGameStage(stages[2].name)
      }    
  }, [guesses])
  
  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    console.log(uniqueLetters)
    console.log(guessedLetters)

    // win condiion
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // add score
      setScore((actualScore) => actualScore += 100 ) 

      // restartar game with new word
      startGame()
    }
  }, [guessedLetters, letters, startGame, gameStage])
  
  return (
    <div className="App">
     {gameStage === "start" && <StartScreen startGame={startGame} />}
     {gameStage === "game" && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
      />)}
     {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
  
}

export default App;
