import { LOWERCASE, NUMBERS, SYMBOLS, UPPERCASE } from "../constants/chars";

export type PasswordOptions = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

export const generatePassword = (options: PasswordOptions): string => {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;

  let validChars = "";

  if (includeUppercase) validChars += UPPERCASE;
  if (includeLowercase) validChars += LOWERCASE;
  if (includeNumbers) validChars += NUMBERS;
  if (includeSymbols) validChars += SYMBOLS;

  if (!validChars) return "";

  let password = ensureAtLeastOneChar(options);

  for (let i = password.length; i < length; i++) {
    const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
    password += randomChar;
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const ensureAtLeastOneChar = (options: PasswordOptions) => {
  const { includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;

  let temp = "";

  if (includeUppercase) temp += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  if (includeLowercase) temp += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  if (includeNumbers) temp += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  if (includeSymbols) temp += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  return temp;
};
