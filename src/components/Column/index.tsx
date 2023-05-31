import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PropsWithChildren } from 'react';

import { useStyles } from '../../theme';
import { H4 } from '../Text/TextElements';

interface ColumnProps {
  title: string;
  color: string;
}

const Column = (props: PropsWithChildren<ColumnProps>) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <H4>{props.title}</H4>
      <div className={styles.contents}>{props.children}</div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      width: 33%;
      margin: ${theme.spacing(2)};
    `,
    contents: css`
      height: 80vh;
      margin-top: ${theme.spacing(2)};
      border: rgba(204, 204, 220, 0.07) solid 1px;
      border-radius: 2px;
      background-color: ${theme.colors.background.secondary};
    `,
  };
};

export default Column;
