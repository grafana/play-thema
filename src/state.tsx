import React, { useContext, useState } from 'react';

export interface State {
  input: string;
  setInput: (input?: string) => void;

  lineage: string;
  setLineage: (lineage: string) => void;
}

const InputContext = React.createContext({ input: '', setInput: (_: string) => {} });
const LineageContext = React.createContext({ lineage: '', setLineage: (_: string) => {} });

// Input state provider
export const InputProvider = ({ children }: React.PropsWithChildren) => {
  const [input, setInput] = useState(`{\n  "firstfield": "value"\n}`);

  // Remember to pass the state and the updater function to the provider
  return <InputContext.Provider value={{ input, setInput }}>{children}</InputContext.Provider>;
};

// Lineage state provider
export const LineageProvider = ({ children }: React.PropsWithChildren) => {
  const [lineage, setLineage] = useState(
    `// Paste or type a Thema lineage here.\n// You can also load an example from the toolbar.\n// About lineages: https://github.com/grafana/thema#thema`
  );

  // Remember to pass the state and the updater function to the provider
  return <LineageContext.Provider value={{ lineage, setLineage }}>{children}</LineageContext.Provider>;
};

// Input state hook
export function useInputContext() {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInputContext must be used within the InputProvider');
  }
  return context;
}

// Lineage state hook
export function useLineageContext() {
  const context = useContext(LineageContext);
  if (!context) {
    throw new Error('useLineageContext must be used within the LineageProvider');
  }
  return context;
}
