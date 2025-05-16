import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Country, Guess, GameStatus, MAX_ATTEMPTS } from "../types";
import {
  evaluateGuess,
  selectRandomCountry,
  generateCrimeStats,
} from "../utils/gameUtils";
import countriesData from "../data/suitable_countries.json";

interface GameContextType {
  countries: Country[];
  targetCountry: Country | null;
  guesses: Guess[];
  gameStatus: GameStatus;
  isLoading: boolean;
  makeGuess: (country: Country) => void;
  startNewGame: () => void;
  remainingAttempts: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.IN_PROGRESS
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize game
  useEffect(() => {
    // Load countries data and generate crime statistics for all countries
    const enhancedCountries = (countriesData as Country[]).map((country) =>
      generateCrimeStats(country)
    );
    setCountries(enhancedCountries);
    setIsLoading(false);
  }, []);

  // Start a new game when countries are loaded
  useEffect(() => {
    if (countries.length > 0 && !targetCountry) {
      startNewGame();
    }
  }, [countries, targetCountry]);

  const startNewGame = () => {
    const newTargetCountry = selectRandomCountry(countries);
    setTargetCountry(newTargetCountry);
    setGuesses([]);
    setGameStatus(GameStatus.IN_PROGRESS);
    console.log("New target country:", newTargetCountry.country_name);
  };

  const makeGuess = (country: Country) => {
    if (gameStatus !== GameStatus.IN_PROGRESS || !targetCountry) {
      return;
    }

    // Evaluate guess
    const result = evaluateGuess(country, targetCountry);
    const newGuess: Guess = { country, result };

    // Add to guesses
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);

    // Check if the guess is correct
    if (result.correct) {
      setGameStatus(GameStatus.WON);
    } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus(GameStatus.LOST);
    }
  };

  const remainingAttempts = MAX_ATTEMPTS - guesses.length;

  return (
    <GameContext.Provider
      value={{
        countries,
        targetCountry,
        guesses,
        gameStatus,
        isLoading,
        makeGuess,
        startNewGame,
        remainingAttempts,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
