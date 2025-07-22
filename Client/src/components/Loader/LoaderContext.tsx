"use client";
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

type LoaderContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  setLoading: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
