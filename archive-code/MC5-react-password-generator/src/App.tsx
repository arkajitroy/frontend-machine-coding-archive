import { useState } from "react";
import { Copy, RefreshCcw } from "lucide-react";
import { generatePassword, type PasswordOptions } from "./libs/password";

import styles from "./app.module.css";

export default function App() {
  const [password, setPassword] = useState<string>("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 8,
    includeUppercase: false,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleGeneratePassword = () => {
    const _password = generatePassword(options);
    setPassword(_password);
    setCopied(false);
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleModifyOptions = (
    key: keyof PasswordOptions,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setOptions((prev) => {
      return { ...prev, [key]: key === "length" ? Number(value) : checked };
    });
  };

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Password Generator</h3>

      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <label>Password Length</label>
          <input
            type="number"
            min={4}
            max={64}
            value={options.length}
            onChange={(event) => handleModifyOptions("length", event)}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(event) =>
                handleModifyOptions("includeUppercase", event)
              }
            />
            Uppercase (A-Z)
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(event) =>
                handleModifyOptions("includeLowercase", event)
              }
            />
            Lowercase (a-z)
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(event) => handleModifyOptions("includeNumbers", event)}
            />
            Numbers (0-9)
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(event) => handleModifyOptions("includeSymbols", event)}
            />
            Symbols (!@#$)
          </label>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button
          onClick={handleGeneratePassword}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          <RefreshCcw size={16} /> Generate
        </button>
        <button
          onClick={handleCopyPassword}
          className={`${styles.btn} ${styles.btnSecondary}`}
          disabled={!password}
        >
          <Copy size={16} /> {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={styles.outputBox}>
        {password || "Click Generate to create a password"}
      </div>
    </main>
  );
}
