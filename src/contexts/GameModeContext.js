import React, { createContext, useState, useContext } from "react";

// Создаём контекст
const GameModeContext = createContext();

// Хук для использования контекста
export const useGameMode = () => useContext(GameModeContext);

// Провайдер
export const GameModeProvider = ({ children }) => {
  const [mistakeMode, setMistakeMode] = useState(false); // Режим игры
  const [mistakes, setMistakes] = useState(0); // Количество ошибок

  // Сброс ошибок
  const resetMistakes = () => setMistakes(0);

  // Увеличение счётчика ошибок
  const addMistake = () => {
    setMistakes(prev => prev + 1);
  };

  return (
    <GameModeContext.Provider
      value={{
        mistakeMode,
        setMistakeMode,
        mistakes,
        addMistake,
        resetMistakes,
      }}
    >
      {children}
    </GameModeContext.Provider>
  );
};
