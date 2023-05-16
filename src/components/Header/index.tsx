import OpSelector from './OpSelector';
import { fmtCue, fmtJson } from '../../services/format';
import { tryOrReport } from '../../helpers';
import Examples from './Examples';
import ThemeSwitch from './ThemeSwitch';
import { useInputContext, useLineageContext } from '../../state';
import Share from './Share';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles } from '../../theme';
import { css } from '@emotion/css';
import { Button } from '@grafana/ui';

const Header = () => {
  const styles = useStyles(getStyles);
  return (
    <div className={styles.header}>
      <div className={styles.flex}>
        <img src={'/grafana.svg'} alt={'Grafana logo'} className={styles.logo} />
        <h4 className={styles.headerText}>Thema Playground</h4>
      </div>
      <div className={styles.flex}>
        <div className={styles.flex}>
          <Examples />
          <Share />
          <FormatButton />
          <OpSelector />
        </div>
        <ThemeSwitch className={styles.themeSwitch} />
      </div>
    </div>
  );
};

const FormatButton = () => {
  const { input, setInput } = useInputContext();
  const { lineage, setLineage } = useLineageContext();

  const formatFn = () => {
    tryOrReport(() => {
      setInput(fmtJson(input));
      setLineage(fmtCue(lineage));
    }, true);
  };

  return (
    <Button onClick={formatFn} variant={'secondary'}>
      Format
    </Button>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    flex: css`
      display: flex;
      align-items: center;

      & > * {
        margin-right: ${theme.spacing(2)};
      }
    `,
    header: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      height: 60px;
      width: 100vw;
      padding: 10px 40px;
      border: 1px solid ${theme.colors.border.weak};
      border-radius: 2px;
      color: ${theme.colors.text.primary};
    `,
    headerText: css`
      margin-bottom: 0;
    `,
    themeSwitch: css`
      color: #3d71d9;
      cursor: pointer;
    `,
    logo: css`
      width: 20px;
      height: 20px;
      margin-right: 10px;
    `,
  };
};
export default Header;
