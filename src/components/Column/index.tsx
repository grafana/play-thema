import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles } from '../../theme';
import { PropsWithChildren } from 'react';

interface ColumnProps {
  title: string;
  color: string;
}

const Column = (props: PropsWithChildren<ColumnProps>) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <h3>{`${props.title}:`}</h3>
      <div className={styles.contents}>{props.children}</div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      height: 80vh;
      width: 33vw;
      padding-top: 20px;
    `,
    contents: css`
      height: 80vh;
      margin: 1vh 1vw;
      padding: 10px;
      border: rgba(204, 204, 220, 0.07) solid 1px;
      border-radius: 2px;
      background-color: ${theme.colors.background.secondary};
    `,
  };
};

export default Column;
