#!/usr/bin/env python3
import pandas as pd
from pathlib import Path
import json


def check_data_quality() -> None:
    """
    Test the quality of the downloaded crime data.
    Identifies countries with complete crime statistics.
    """
    # Load the game data
    data_dir = Path("data")
    data_file = data_dir / "criminle_game_data.csv"

    if not data_file.exists():
        print(f"Data file {data_file} not found!")
        return

    # Load the data
    df = pd.read_csv(data_file)

    # Print basic statistics
    print(f"Total countries in dataset: {len(df)}")

    # Check for missing values
    print("\nMissing values by column:")
    for col in df.columns:
        missing = df[col].isna().sum()
        percent_missing = 100 * missing / len(df)
        print(f"  {col}: {missing} ({percent_missing:.2f}%)")

    # Get countries with homicide data
    countries_with_homicide = df[~df["homicide_rate"].isna()]
    print(f"\nCountries with homicide data: {len(countries_with_homicide)}")

    # Get countries with region data
    countries_with_region = df[~df["region"].isna()]
    print(f"Countries with region data: {len(countries_with_region)}")

    # Get countries with complete data (all essential fields)
    complete_data = df[
        ~df["country_name"].isna()
        & ~df["iso_code"].isna()
        & ~df["homicide_rate"].isna()
        & ~df["region"].isna()
    ]
    print(f"Countries with complete essential data: {len(complete_data)}")

    # Get statistics on homicide rates
    if not countries_with_homicide.empty:
        print("\nHomicide rate statistics:")
        print(f"  Min: {countries_with_homicide['homicide_rate'].min():.2f}")
        print(f"  Max: {countries_with_homicide['homicide_rate'].max():.2f}")
        print(f"  Mean: {countries_with_homicide['homicide_rate'].mean():.2f}")
        print(f"  Median: {countries_with_homicide['homicide_rate'].median():.2f}")

        # Countries with highest and lowest homicide rates
        highest = countries_with_homicide.nlargest(5, "homicide_rate")
        lowest = countries_with_homicide.nsmallest(5, "homicide_rate")

        print("\nTop 5 countries with highest homicide rates:")
        for _, row in highest.iterrows():
            print(f"  {row['country_name']}: {row['homicide_rate']:.2f}")

        print("\nTop 5 countries with lowest homicide rates:")
        for _, row in lowest.iterrows():
            print(f"  {row['country_name']}: {row['homicide_rate']:.2f}")

    # Group countries by region
    if not countries_with_region.empty:
        region_counts = countries_with_region["region"].value_counts()
        print("\nCountries by region:")
        for region, count in region_counts.items():
            print(f"  {region}: {count}")

    # Save a list of countries suitable for the game
    suitable_countries = complete_data.to_dict(orient="records")

    if suitable_countries:
        with open(data_dir / "suitable_countries.json", "w") as f:
            json.dump(suitable_countries, f, indent=2)

        print(
            f"\nSaved {len(suitable_countries)} suitable countries for the game to suitable_countries.json"
        )


if __name__ == "__main__":
    check_data_quality()
