import React, { CSSProperties, useContext } from 'react';
import OpSelector from './OpSelector';
import { fmtCue, fmtJson } from '../../services/format';
import { tryOrReport } from '../../helpers';
import Examples from './Examples';
import ThemeSwitch from './ThemeSwitch';
import { StateContext } from '../../state';
import Share from './Share';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles } from '../../theme';
import { css } from '@emotion/css';
import { Button } from '@grafana/ui';

const Header = () => {
  const { input, lineage, setInput, setLineage } = useContext(StateContext);
  const styles = useStyles(getStyles);
  const formatFn = () => {
    tryOrReport(() => {
      setInput(fmtJson(input));
      setLineage(fmtCue(lineage));
    }, true);
  };

  return (
    <div className={styles.header}>
      <h3>Thema Playground</h3>
      <Share />
      <OpSelector />
      <Button onClick={formatFn}>Format</Button>
      <Examples />
      <ThemeSwitch className={styles.themeSwitch} />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    header: css`
      display: flex;
      gap: 20px;
      height: 60px;
      width: 100vw;
      padding: 10px 40px;
      border: 1px solid ${theme.colors.border.weak};
      border-radius: 2px;
      color: ${theme.colors.text.primary};
    `,
    input: css`
      width: 250px;
      font-size: 15px;
      margin: 1px 0;
    `,
    examples: css`
      margin-left: 10vw;
      margin-right: 1vw;
      display: flex;
    `,
    themeSwitch: css`
      color: #3d71d9;
      cursor: pointer;
    `,
  };
};
export default Header;
