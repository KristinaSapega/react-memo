import React, { createContext, useState, useContext } from "react";

// Создаём контекст
const LeadersContex = createContext();

// Хук для использования контекста
export const useLeadersContext = () => useContext(LeadersContex);

// Провайдер
export const LeadersProvider = ({ children }) => {
  const [leaders, setLeaders] = useState([]);

  return <LeadersContex.Provider value={{ leaders, setLeaders }}>{children}</LeadersContex.Provider>;
};
