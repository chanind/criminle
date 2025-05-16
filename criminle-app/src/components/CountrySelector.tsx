import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import styled from "styled-components";
import { Country } from "../types";

const SelectorContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 1rem auto;
`;

const SubmitButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c72c48;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

interface OptionType {
  value: string;
  label: string;
  country: Country;
}

// Custom styles for the select component to match dark theme
const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#16213e",
    borderColor: state.isFocused ? "#e94560" : "#0f3460",
    borderRadius: "4px",
    boxShadow: state.isFocused ? "0 0 0 1px #e94560" : "none",
    "&:hover": {
      borderColor: "#e94560",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#16213e",
    border: "1px solid #0f3460",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#e94560"
      : state.isFocused
      ? "#0f3460"
      : "#16213e",
    color: "white",
    "&:hover": {
      backgroundColor: "#0f3460",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#cccccc",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#cccccc",
    "&:hover": {
      color: "#e94560",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#cccccc",
    "&:hover": {
      color: "#e94560",
    },
  }),
};

interface CountrySelectorProps {
  countries: Country[];
  onGuess: (country: Country) => void;
  disabled: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  onGuess,
  disabled,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const options: OptionType[] = countries.map((country) => ({
    value: country.iso_code,
    label: country.country_name,
    country: country,
  }));

  const handleSubmit = () => {
    if (selectedCountry) {
      onGuess(selectedCountry);
      setSelectedCountry(null);
    }
  };

  return (
    <SelectorContainer>
      <Select<OptionType>
        options={options}
        onChange={(option) =>
          setSelectedCountry(option ? option.country : null)
        }
        placeholder="Select a country..."
        isDisabled={disabled}
        value={
          options.find((option) => option.country === selectedCountry) || null
        }
        styles={customStyles}
      />
      <SubmitButton
        onClick={handleSubmit}
        disabled={!selectedCountry || disabled}
      >
        Submit Guess
      </SubmitButton>
    </SelectorContainer>
  );
};

export default CountrySelector;
