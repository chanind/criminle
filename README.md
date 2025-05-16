# Criminle

A Wordle-style game where players guess countries based on crime statistics. 

Try it out: https://chanind.github.io/criminle

## Setup

1. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Download crime statistics:
   ```
   python scripts/download_crime_data.py
   ```

## Dataset

The game uses crime statistics from multiple sources:

- **World Bank API**: Intentional homicides per 100,000 people
- **Global Peace Index**: Peace index scores by country
- **Country metadata**: ISO codes, regions, and other country information

Our cleaned dataset includes:

- 249 countries and territories
- 176 countries with complete data for use in the game
- Homicide rates ranging from 0.00 to 52.13 per 100,000 people
- Geographic representation across all major regions

To analyze the dataset:

```
python scripts/test_data.py
```

## Project Structure

- `data/`: Contains downloaded crime statistics datasets

  - `criminle_game_data.csv`: Complete dataset with all countries
  - `criminle_game_data.json`: JSON version of the complete dataset
  - `suitable_countries.json`: Filtered dataset of countries with complete data
  - `worldbank_homicide_data.csv`: Raw data from World Bank
  - `country_metadata.csv`: Country codes, regions, and other metadata

- `scripts/`: Utility scripts
  - `download_crime_data.py`: Downloads and processes crime data
  - `test_data.py`: Analyzes data quality and generates statistics
