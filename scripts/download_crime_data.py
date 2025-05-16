#!/usr/bin/env python3
import json
import os
import requests
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
from pathlib import Path
import io
import zipfile
import csv

# Create data directory if it doesn't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)


def fetch_worldbank_homicide_data() -> pd.DataFrame:
    """
    Fetch intentional homicides data from World Bank API.
    Returns a DataFrame with homicide rates by country.
    """
    print("Fetching World Bank homicide data...")

    # World Bank API endpoint for intentional homicides (per 100,000 people)
    # Get the most recent 5 years of data
    url = "https://api.worldbank.org/v2/country/all/indicator/VC.IHR.PSRC.P5?format=json&per_page=1000&mrnev=5"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            # Extract the relevant data
            if len(data) >= 2:
                records = []
                for item in data[1]:
                    if item["value"] is not None and item["countryiso3code"] != "":
                        records.append(
                            {
                                "country": item["country"]["value"],
                                "iso_code": item["countryiso3code"],
                                "homicide_rate": item["value"],
                                "year": item["date"],
                            }
                        )

                wb_df = pd.DataFrame(records)
                print(
                    f"Retrieved World Bank data for {len(records)} records across {wb_df['country'].nunique()} countries"
                )
                return wb_df
            else:
                print("No data found in World Bank response")
                return pd.DataFrame()
        else:
            print(f"Failed to fetch World Bank data: {response.status_code}")
            return pd.DataFrame()
    except Exception as e:
        print(f"Error fetching World Bank data: {e}")
        return pd.DataFrame()


def fetch_gpi_data() -> pd.DataFrame:
    """
    Fetch Global Peace Index data.
    Returns a DataFrame with peace index scores by country.
    """
    print("Fetching Global Peace Index data...")

    # The URL for the Vision of Humanity GPI data
    url = "https://www.visionofhumanity.org/wp-content/uploads/2022/06/GPI-2022-web.pdf"

    # Since we can't easily parse PDF directly, we'll use a pre-processed CSV
    # hosted on a public repository
    gpi_url = "https://raw.githubusercontent.com/owid/peace-research/main/datasets/Global%20Peace%20Index%20(Institute%20for%20Economics%20%26%20Peace)/global-peace-index.csv"

    try:
        gpi_df = pd.read_csv(gpi_url)
        print(
            f"Retrieved Global Peace Index data for {gpi_df['Entity'].nunique()} countries"
        )
        return gpi_df
    except Exception as e:
        print(f"Error fetching Global Peace Index data: {e}")
        return pd.DataFrame()


def fetch_country_metadata() -> pd.DataFrame:
    """
    Fetch country metadata including names, codes, and flags.
    """
    print("Fetching country metadata...")

    url = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv"

    try:
        countries_df = pd.read_csv(url)
        print(f"Retrieved metadata for {len(countries_df)} countries")
        return countries_df
    except Exception as e:
        print(f"Error fetching country metadata: {e}")
        return pd.DataFrame()


def process_and_merge_data(
    homicide_df: pd.DataFrame, gpi_df: pd.DataFrame, countries_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Process and merge the different datasets to create a comprehensive dataset for the game.
    """
    print("Processing and merging datasets...")

    # Process homicide data - get the most recent data for each country
    if not homicide_df.empty:
        # Convert year to numeric for proper sorting
        homicide_df["year"] = pd.to_numeric(homicide_df["year"])

        # Sort by year (descending) and keep the most recent entry for each country
        homicide_df = homicide_df.sort_values("year", ascending=False)
        homicide_df = homicide_df.drop_duplicates(subset=["iso_code"], keep="first")

    # Process GPI data - get the most recent data
    if not gpi_df.empty:
        # Keep only the most recent year
        latest_year = gpi_df["Year"].max()
        gpi_recent_df = gpi_df[gpi_df["Year"] == latest_year].copy()

        # Rename columns for consistency
        gpi_recent_df = gpi_recent_df.rename(
            columns={
                "Entity": "country_name",
                "Code": "iso_code",
                "Year": "gpi_year",
                "GPI (Index)": "peace_index",
                "GPI (Rank)": "peace_rank",
            }
        )
    else:
        gpi_recent_df = pd.DataFrame()

    # Prepare country metadata
    if not countries_df.empty:
        countries_df = countries_df.rename(
            columns={
                "name": "country_name",
                "alpha-3": "iso_code",
                "region": "region",
                "sub-region": "subregion",
            }
        )

        # Select only relevant columns
        metadata_df = countries_df[["country_name", "iso_code", "region", "subregion"]]
    else:
        metadata_df = pd.DataFrame()

    # Merge the datasets
    # First merge homicide with countries metadata
    if not homicide_df.empty and not metadata_df.empty:
        merged_df = pd.merge(
            metadata_df,
            homicide_df[["iso_code", "homicide_rate", "year"]],
            on="iso_code",
            how="left",
        )

        # Then merge with GPI data
        if not gpi_recent_df.empty:
            merged_df = pd.merge(
                merged_df,
                gpi_recent_df[["iso_code", "peace_index", "peace_rank", "gpi_year"]],
                on="iso_code",
                how="left",
            )
    elif not metadata_df.empty and not gpi_recent_df.empty:
        # If we only have metadata and GPI data
        merged_df = pd.merge(
            metadata_df,
            gpi_recent_df[["iso_code", "peace_index", "peace_rank", "gpi_year"]],
            on="iso_code",
            how="left",
        )
    else:
        # Fallback to whatever we have
        if not metadata_df.empty:
            merged_df = metadata_df
        elif not homicide_df.empty:
            merged_df = homicide_df
        elif not gpi_recent_df.empty:
            merged_df = gpi_recent_df
        else:
            merged_df = pd.DataFrame()

    # Drop rows with missing country name or iso_code
    if not merged_df.empty:
        merged_df = merged_df.dropna(subset=["country_name", "iso_code"])

    print(f"Created merged dataset with {len(merged_df)} countries")
    return merged_df


def add_country_flags(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add flag emoji and URLs to the countries dataset.
    """
    if df.empty:
        return df

    # Add flag emoji - create a mapping dictionary
    # The flag emoji is created by converting the two ISO 3166-1 alpha-2 letters to regional indicator symbols
    # But this is complex for direct mapping, so we'll add flag URLs instead

    # Add flag URLs
    df["flag_url"] = df["iso_code"].apply(
        lambda code: (
            f"https://flagcdn.com/w320/{code.lower()[:2]}.png"
            if isinstance(code, str) and len(code) >= 2
            else ""
        )
    )

    return df


def main() -> None:
    """
    Main function to orchestrate the data collection process.
    """
    # Fetch data from different sources
    homicide_df = fetch_worldbank_homicide_data()
    gpi_df = fetch_gpi_data()
    countries_df = fetch_country_metadata()

    # Save individual datasets
    if not homicide_df.empty:
        homicide_df.to_csv(data_dir / "worldbank_homicide_data.csv", index=False)

    if not gpi_df.empty:
        gpi_df.to_csv(data_dir / "global_peace_index.csv", index=False)

    if not countries_df.empty:
        countries_df.to_csv(data_dir / "country_metadata.csv", index=False)

    # Process and merge the data
    merged_df = process_and_merge_data(homicide_df, gpi_df, countries_df)

    # Add country flags
    merged_df = add_country_flags(merged_df)

    # Save the final dataset
    if not merged_df.empty:
        merged_df.to_csv(data_dir / "criminle_game_data.csv", index=False)
        merged_df.to_json(data_dir / "criminle_game_data.json", orient="records")
        print(f"Saved final dataset with {len(merged_df)} countries to CSV and JSON")
    else:
        print("Failed to create a merged dataset")


if __name__ == "__main__":
    main()
