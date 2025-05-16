# Criminle

A Wordle-style game where you guess countries based on their crime statistics.

## Game Overview

In Criminle, you are presented with crime statistics about a country, including:

- Homicide rate per 100,000 people
- Region and subregion
- Year of data collection

Your goal is to guess the country within 6 attempts. After each guess, you'll receive feedback on:

- Whether the region/subregion matches
- Whether the homicide rate is higher, lower, or close to the target country

## Technologies Used

- React
- TypeScript
- Styled Components
- Data sourced from World Bank and country metadata repositories

## Running Locally

1. Clone the repository
2. Navigate to the `criminle-app` directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To create a production build:

```
npm run build
```

The build files will be created in the `build` directory.

## About the Data

The crime statistics used in this game are sourced from:

- World Bank Homicide Data
- Country metadata with regions and subregions
- Flag URLs from flagcdn.com

## License

This project is open source and available under the MIT License.
