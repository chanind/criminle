import { Country, Guess, GuessResult } from "../types";

// Evaluate how close the guess is to the target country
export const evaluateGuess = (
  guessCountry: Country,
  targetCountry: Country
): GuessResult => {
  const correct = guessCountry.iso_code === targetCountry.iso_code;
  const regionMatch = guessCountry.region === targetCountry.region;
  const subregionMatch = guessCountry.subregion === targetCountry.subregion;

  // Calculate homicide rate hint
  const homicideRateHint = calculateStatHint(
    guessCountry.homicide_rate,
    targetCountry.homicide_rate
  );

  // Calculate hints for other crime statistics
  const propertyHint = calculateStatHint(
    guessCountry.property_crime_index,
    targetCountry.property_crime_index
  );

  const robberyHint = calculateStatHint(
    guessCountry.robbery_rate,
    targetCountry.robbery_rate
  );

  const safetyHint = calculateStatHint(
    guessCountry.safety_index,
    targetCountry.safety_index
  );

  const incarcerationHint = calculateStatHint(
    guessCountry.incarceration_rate,
    targetCountry.incarceration_rate
  );

  // Calculate a rough "distance" score
  const distance = calculateDistance(guessCountry, targetCountry);

  return {
    correct,
    regionMatch,
    subregionMatch,
    homicideRateHint,
    propertyHint,
    robberyHint,
    safetyHint,
    incarcerationHint,
    distance,
  };
};

// Calculate hints for any numeric statistic
const calculateStatHint = (
  guessValue: number,
  targetValue: number
): "higher" | "lower" | "close" | "exact" => {
  if (guessValue === targetValue) {
    return "exact";
  }

  const valueDiff = Math.abs(guessValue - targetValue);
  const valuePercent = (valueDiff / targetValue) * 100;

  if (valuePercent <= 10) {
    return "close";
  } else if (guessValue > targetValue) {
    return "higher";
  } else {
    return "lower";
  }
};

// Select a random country from the available countries
export const selectRandomCountry = (countries: Country[]): Country => {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
};

// Calculate a simple distance metric between countries
const calculateDistance = (country1: Country, country2: Country): number => {
  let distance = 0;

  // Region comparison
  if (country1.region !== country2.region) {
    distance += 3;
  } else if (country1.subregion !== country2.subregion) {
    distance += 1;
  }

  // Crime statistics comparison (normalize the differences)
  const homicideRateDiff = Math.abs(
    country1.homicide_rate - country2.homicide_rate
  );
  const maxRate = Math.max(50, country1.homicide_rate, country2.homicide_rate); // Use 50 as a rough max for normalization
  distance += (homicideRateDiff / maxRate) * 5;

  // Add distances for other crime statistics
  const propertyDiff = Math.abs(
    country1.property_crime_index - country2.property_crime_index
  );
  distance += (propertyDiff / 100) * 2;

  const robberyDiff = Math.abs(country1.robbery_rate - country2.robbery_rate);
  distance += (robberyDiff / 100) * 2;

  const safetyDiff = Math.abs(country1.safety_index - country2.safety_index);
  distance += (safetyDiff / 100) * 2;

  return distance;
};

// Generate derived crime statistics from homicide rate
export const generateCrimeStats = (country: Country): Country => {
  // Use homicide rate as a base to create other statistics with some randomness
  const baseRate = country.homicide_rate;

  // Property crime tends to be higher than homicide but correlated
  const propertyFactor = Math.random() * 2 + 3; // Between 3-5x homicide rate
  const property_crime_index = Math.min(
    100,
    baseRate * propertyFactor + Math.random() * 10
  );

  // Robbery rate is typically lower than property crime but higher than homicide
  const robberyFactor = Math.random() * 1.5 + 1.5; // Between 1.5-3x homicide rate
  const robbery_rate = Math.min(
    50,
    baseRate * robberyFactor + Math.random() * 5
  );

  // Safety index is inversely related to crime rates (higher means safer)
  // Countries with low homicide rates have higher safety
  const safetyBase = Math.max(0, 100 - baseRate * 3);
  const safetyVariance = Math.random() * 20 - 10; // +/- 10 points of variance
  const safety_index = Math.min(100, Math.max(0, safetyBase + safetyVariance));

  // Incarceration rate often correlates with crime rates but with significant variance
  const incarcerationBase = baseRate * (Math.random() * 20 + 10); // 10-30x homicide rate
  const incarceration_rate = Math.min(1000, Math.max(10, incarcerationBase));

  return {
    ...country,
    property_crime_index,
    robbery_rate,
    safety_index,
    incarceration_rate,
  };
};
