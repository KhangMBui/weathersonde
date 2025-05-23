import React, { createContext, useContext, useState } from "react";

type RecordingContextType = {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
};

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <RecordingContext.Provider value={{ isRecording, setIsRecording }}>
      {children}
    </RecordingContext.Provider>
  );
};

export function useRecording() {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error("useRecording must be used within a RecordingProvider");
  }
  return context;
}
