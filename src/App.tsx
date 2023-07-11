import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

import { Actions } from './components/Actions';
import { InputEditor } from './components/CodeEditor/InputEditor';
import { LineageEditor } from './components/CodeEditor/LineageEditor';
import Column from './components/Column';
import { Nav } from './components/Nav';
import { Output } from './components/Output';
import { useStyles } from './theme';

const App = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <Nav />
      <Actions />
      <div className={styles.wrapper}>
        <Column title="JSON Input" color="green">
          <InputEditor />
        </Column>
        <Column title="CUE Lineage" color="green">
          <LineageEditor />
        </Column>
        <Output />
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
      min-height: 100vh;
      height: 100%;
    `,
    wrapper: css`
      display: flex;

      & > div {
        margin-right: ${theme.spacing(1)};
      }
    `,
  };
};

export default App;
