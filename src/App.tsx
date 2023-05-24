import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

import { Actions } from './components/Actions';
import { InputEditor } from './components/CodeEditor/InputEditor';
import { LineageEditor } from './components/CodeEditor/LineageEditor';
import Column from './components/Column';
import Console from './components/Console';
import { Nav } from './components/Nav';
import { useStyles } from './theme';

const App = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <Nav />
      <Actions />
      <div className={styles.wrapper}>
        <Column title="LINEAGE (CUE)" color="green">
          <LineageEditor />
        </Column>
        <Column title="INPUT DATA (JSON)" color="green">
          <InputEditor />
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
