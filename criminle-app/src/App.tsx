import React from "react";
import styled from "styled-components";
import { GameProvider, useGame } from "./context/GameContext";
import Header from "./components/Header";
import Game from "./components/Game";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #0f0f1b;
  color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1rem;
  background-color: #1a1a2e;
  font-size: 0.875rem;
  color: #cccccc;
`;

const AppContent: React.FC = () => {
  const { startNewGame } = useGame();

  return (
    <AppContainer>
      <Header newGame={startNewGame} />
      <MainContent>
        <Game />
      </MainContent>
      <Footer>
        Created for Criminle &copy; {new Date().getFullYear()} | Data from World
        Bank
      </Footer>
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
