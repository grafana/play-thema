import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PropsWithChildren } from 'react';

import { useStyles } from '../../theme';

interface ColumnProps {
  title: string;
  color: string;
}

const Column = (props: PropsWithChildren<ColumnProps>) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <div className={styles.contents}>{props.children}</div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      width: 33%;
      margin: ${theme.spacing(0, 0, 2)};
    `,
    contents: css`
      height: 80vh;

      border: rgba(204, 204, 220, 0.07) solid 1px;
      border-radius: 2px;
      background-color: ${theme.colors.background.secondary};
      display: flex;
      flex-direction: column;
    `,
    row: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
  };
};

export default Column;
