import React, { createContext, useContext, useState } from "react";

interface HistoricalDataContextType {
  historicalData: any[];
  setHistoricalData: React.Dispatch<React.SetStateAction<any[]>>;
}

const HistoricalDataContext = createContext<
  HistoricalDataContextType | undefined
>(undefined);

export const HistoricalDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  return (
    <HistoricalDataContext.Provider
      value={{ historicalData, setHistoricalData }}
    >
      {children}
    </HistoricalDataContext.Provider>
  );
};

export const useHistoricalData = () => {
  const context = useContext(HistoricalDataContext);
  if (!context) {
    throw new Error(
      "useHistoricalData must be used within a HistoricalDataProvider"
    );
  }
  return context;
};
