import { countries as countriesData } from "countries-list";

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const countries: Country[] = Object.entries(countriesData)
  .map(([code, country]) => ({
    code,
    name: country.name,
    flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find((country) => country.code === code);
};
