import React from "react";
import styled from "styled-components";
import { Country, GameStatus } from "../types";

const StatsContainer = styled.div`
  background-color: #16213e;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem auto;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StatTitle = styled.h2`
  color: #e94560;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
`;

const StatItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #1a1a2e;
  border-radius: 4px;
`;

const StatLabel = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #cccccc;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  color: white;
`;

interface RevealProps {
  bgColor: string;
}

const RevealContainer = styled.div<RevealProps>`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${(props) => props.bgColor};
  border-radius: 8px;
  animation: fadeIn 1s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const CountryName = styled.h2`
  margin: 0;
  font-size: 2rem;
`;

const CountryFlag = styled.img`
  width: 80px;
  height: 48px;
  margin: 1rem 0;
  border: 1px solid #ccc;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

interface GameStatsProps {
  targetCountry: Country | null;
  remainingAttempts: number;
  gameStatus: GameStatus;
}

const GameStats: React.FC<GameStatsProps> = ({
  targetCountry,
  remainingAttempts,
  gameStatus,
}) => {
  if (!targetCountry) {
    return <div>Loading...</div>;
  }

  return (
    <StatsContainer>
      <StatTitle>Country Crime Statistics</StatTitle>

      <StatsGrid>
        <StatItem>
          <StatLabel>Homicide Rate (per 100,000)</StatLabel>
          <StatValue>{targetCountry.homicide_rate.toFixed(2)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Property Crime Index</StatLabel>
          <StatValue>{targetCountry.property_crime_index.toFixed(1)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Robbery Rate</StatLabel>
          <StatValue>{targetCountry.robbery_rate.toFixed(1)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Safety Index (0-100)</StatLabel>
          <StatValue>{targetCountry.safety_index.toFixed(1)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Incarceration Rate</StatLabel>
          <StatValue>{targetCountry.incarceration_rate.toFixed(0)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Data Year</StatLabel>
          <StatValue>{targetCountry.year}</StatValue>
        </StatItem>
      </StatsGrid>

      {gameStatus !== GameStatus.IN_PROGRESS && (
        <RevealContainer
          bgColor={gameStatus === GameStatus.WON ? "#4caf5066" : "#f4433666"}
        >
          <CountryName>{targetCountry.country_name}</CountryName>
          <CountryFlag
            src={targetCountry.flag_url}
            alt={`${targetCountry.country_name} flag`}
          />
          <div>{gameStatus === GameStatus.WON ? "You won!" : "Game over!"}</div>
        </RevealContainer>
      )}

      {gameStatus === GameStatus.IN_PROGRESS && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          Remaining attempts: {remainingAttempts}
        </div>
      )}
    </StatsContainer>
  );
};

export default GameStats;
