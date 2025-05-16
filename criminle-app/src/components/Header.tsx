import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: #1a1a2e;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LogoText = styled.span`
  color: #e94560;
  font-weight: 900;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1rem;
  text-align: center;
  color: #cccccc;
`;

interface HeaderProps {
  newGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ newGame }) => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoText>🔍 CRIMINLE</LogoText>
      </Logo>
      <Subtitle>Guess the country based on crime statistics</Subtitle>
      <button
        onClick={newGame}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        New Game
      </button>
    </HeaderContainer>
  );
};

export default Header;
