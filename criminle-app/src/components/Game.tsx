import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";
import CountrySelector from "./CountrySelector";
import GuessDisplay from "./GuessDisplay";
import GameStats from "./GameStats";
import { GameStatus } from "../types";

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.5rem;
`;

const Game: React.FC = () => {
  const {
    countries,
    targetCountry,
    guesses,
    gameStatus,
    isLoading,
    makeGuess,
    remainingAttempts,
  } = useGame();

  if (isLoading) {
    return <LoadingContainer>Loading crime statistics...</LoadingContainer>;
  }

  return (
    <GameContainer>
      <GameStats
        targetCountry={targetCountry}
        remainingAttempts={remainingAttempts}
        gameStatus={gameStatus}
      />

      <CountrySelector
        countries={countries}
        onGuess={makeGuess}
        disabled={gameStatus !== GameStatus.IN_PROGRESS}
      />

      <GuessDisplay guesses={guesses} />
    </GameContainer>
  );
};

export default Game;
