export interface Country {
  country_name: string;
  iso_code: string;
  region: string;
  subregion: string;
  homicide_rate: number;
  year: number;
  flag_url: string;
  // Derived crime statistics
  property_crime_index: number;
  robbery_rate: number;
  safety_index: number;
  incarceration_rate: number;
}

export interface Guess {
  country: Country;
  result: GuessResult;
}

export interface GuessResult {
  correct: boolean;
  regionMatch: boolean;
  subregionMatch: boolean;
  homicideRateHint: "higher" | "lower" | "close" | "exact";
  propertyHint: "higher" | "lower" | "close" | "exact";
  robberyHint: "higher" | "lower" | "close" | "exact";
  safetyHint: "higher" | "lower" | "close" | "exact";
  incarcerationHint: "higher" | "lower" | "close" | "exact";
  distance: number;
}

export enum GameStatus {
  IN_PROGRESS = "in_progress",
  WON = "won",
  LOST = "lost",
}

export const MAX_ATTEMPTS = 6;
