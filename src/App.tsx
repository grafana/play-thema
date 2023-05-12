import React, { useContext } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import Header from './components/Header';
import Column from './components/Column';
import Console from './components/Console';
import { useTheme2 } from '@grafana/ui';
import { StateContext } from './state';

const App = () => {
  const theme = useTheme2().name.toLowerCase();
  const { input, lineage, setInput, setLineage } = useContext(StateContext);

  return (
    <div className={`App theme-${theme}`} style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
      <Header />
      <Column title="LINEAGE (CUE)" color="green">
        <CodeEditor value={lineage} language="go" onChange={(lineage?: string) => setLineage(lineage || '')} />
      </Column>
      <Column title="INPUT DATA (JSON)" color="green">
        <CodeEditor value={input} language="json" onChange={(input?: string) => setInput(input || '')} />
      </Column>
      <Column title="OUTPUT" color="darkblue">
        <Console />
      </Column>
    </div>
  );
};

export default App;
