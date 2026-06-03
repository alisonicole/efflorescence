"use client";

import { createContext, useContext } from "react";

interface GroundContextType {
  openGround: () => void;
}

export const GroundContext = createContext<GroundContextType>({
  openGround: () => {},
});

export function useGround() {
  return useContext(GroundContext);
}
