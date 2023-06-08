import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

import { useStyles } from '../../theme';
import Examples from './Examples';
import { Format } from './Format';
import OpSelector from './OpSelector';
import Share from './Share';

export function Actions() {
  const styles = useStyles(getStyles);
  return (
    <div className={styles.row}>
      <div className={styles.flex}>
        <Share />
        <Format />
        <Examples />
      </div>
      <OpSelector />
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    row: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacing(2)};
    `,
    flex: css`
      display: flex;
      align-items: center;

      & > * {
        margin-right: ${theme.spacing(2)};
      }
    `,
    headerText: css`
      margin-bottom: 0;
    `,
  };
};
