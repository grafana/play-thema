import React, { useContext } from 'react';
import CodeEditor from './components/CodeEditor';
import Header from './components/Header';
import Column from './components/Column';
import Console from './components/Console';
import { StateContext } from './state';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles } from './theme';

const App = () => {
  const styles = useStyles(getStyles);
  const { input, lineage, setInput, setLineage } = useContext(StateContext);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.wrapper}>
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
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      background: ${theme.colors.background.primary};
      text-align: center;
      font-family: Inter, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      height: 100%;
    `,
    wrapper: css`
      display: flex;
      margin-top: ${theme.spacing(3)};
    `,
  };
};

export default App;
