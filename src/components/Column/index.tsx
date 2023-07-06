import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PropsWithChildren } from 'react';

import { useStyles } from '../../theme';
import { FileUpload } from '../FileUpload';
import { H4 } from '../Text/TextElements';

interface ColumnProps {
  title: string;
  color: string;
}

const Column = (props: PropsWithChildren<ColumnProps>) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <div className={styles.row}>
          <H4>{props.title}</H4>
          <FileUpload />
        </div>
        {props.children}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      width: 33%;
      margin: ${theme.spacing(0, 0, 2)};
      h4 {
        margin: ${theme.spacing(0, 0, 2, 2)};
      }
    `,
    contents: css`
      height: 80vh;
      padding-top: ${theme.spacing(2)};
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
