import React from "react";
import styled from "styled-components";
import { Guess } from "../types";

const GuessContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 1rem auto;
`;

const GuessRow = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background-color: #16213e;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    margin-bottom: 1.5rem;
  }
`;

const GuessHeader = styled(GuessRow)`
  background-color: #0f3460;
  font-weight: bold;
`;

const CountryCell = styled.div`
  display: flex;
  align-items: center;
`;

const CountryFlag = styled.img`
  width: 24px;
  height: 16px;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
`;

const StatIndicator = styled.div<{ hint: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 4px;
  color: ${({ hint }) => {
    if (hint === "exact") return "#4caf50";
    if (hint === "close") return "#ffc107";
    return "#fff";
  }};
  background-color: ${({ hint }) => {
    if (hint === "exact") return "#4caf5033";
    if (hint === "close") return "#ffc10733";
    return "transparent";
  }};
`;

const ArrowIcon = styled.span`
  margin-right: 4px;
`;

const HeaderCell = styled.div`
  text-align: center;

  @media (max-width: 768px) {
    &.mobile-hidden {
      display: none;
    }
  }
`;

const MobileRow = styled.div`
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: grid;
  }
`;

const HiddenOnMobile = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

interface GuessDisplayProps {
  guesses: Guess[];
}

// Helper component for rendering stat hints
const StatHint: React.FC<{ hint: string; value: number }> = ({
  hint,
  value,
}) => (
  <StatIndicator hint={hint}>
    {hint === "exact" ? (
      <span>✓ {value.toFixed(1)}</span>
    ) : hint === "close" ? (
      <span>≈ {value.toFixed(1)}</span>
    ) : hint === "higher" ? (
      <span>
        <ArrowIcon>↓</ArrowIcon>
        {value.toFixed(1)}
      </span>
    ) : (
      <span>
        <ArrowIcon>↑</ArrowIcon>
        {value.toFixed(1)}
      </span>
    )}
  </StatIndicator>
);

const GuessDisplay: React.FC<GuessDisplayProps> = ({ guesses }) => {
  if (guesses.length === 0) {
    return null;
  }

  return (
    <GuessContainer>
      <GuessHeader>
        <div>Country</div>
        <HeaderCell>Homicide</HeaderCell>
        <HeaderCell>Property</HeaderCell>
        <HeaderCell className="mobile-hidden">Robbery</HeaderCell>
        <HeaderCell className="mobile-hidden">Safety</HeaderCell>
        <HeaderCell className="mobile-hidden">Incarceration</HeaderCell>
      </GuessHeader>

      {guesses.map((guess, index) => (
        <React.Fragment key={index}>
          <GuessRow>
            <CountryCell>
              <CountryFlag
                src={guess.country.flag_url}
                alt={`${guess.country.country_name} flag`}
              />
              {guess.country.country_name}
              {guess.result.correct && " ✓"}
            </CountryCell>

            <StatHint
              hint={guess.result.homicideRateHint}
              value={guess.country.homicide_rate}
            />

            <StatHint
              hint={guess.result.propertyHint}
              value={guess.country.property_crime_index}
            />

            <HiddenOnMobile>
              <StatHint
                hint={guess.result.robberyHint}
                value={guess.country.robbery_rate}
              />
            </HiddenOnMobile>

            <HiddenOnMobile>
              <StatHint
                hint={guess.result.safetyHint}
                value={guess.country.safety_index}
              />
            </HiddenOnMobile>

            <HiddenOnMobile>
              <StatHint
                hint={guess.result.incarcerationHint}
                value={guess.country.incarceration_rate}
              />
            </HiddenOnMobile>
          </GuessRow>

          {/* Mobile-only additional row for more stats */}
          <MobileRow>
            <div>
              <small>Robbery</small>
              <StatHint
                hint={guess.result.robberyHint}
                value={guess.country.robbery_rate}
              />
            </div>
            <div>
              <small>Safety</small>
              <StatHint
                hint={guess.result.safetyHint}
                value={guess.country.safety_index}
              />
            </div>
            <div>
              <small>Incarceration</small>
              <StatHint
                hint={guess.result.incarcerationHint}
                value={guess.country.incarceration_rate}
              />
            </div>
          </MobileRow>
        </React.Fragment>
      ))}
    </GuessContainer>
  );
};

export default GuessDisplay;
