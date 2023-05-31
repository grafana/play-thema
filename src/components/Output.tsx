import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Card } from '@grafana/ui';

import { useStyles } from '../theme';

export const Output = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.container}>
      <Card>
        <Card.Heading className={styles.header}>Output</Card.Heading>
        <Card.Description>No output yet. Try loading an example, then validating or translating it.</Card.Description>
      </Card>
      <Card>
        <Card.Heading className={styles.header}>Errors</Card.Heading>
        <Card.Description>No errors.</Card.Description>
      </Card>
      <Card>
        <Card.Heading className={styles.header}>What is Thema?</Card.Heading>
        <Card.Description>
          Thema is a system for writing schemas. Much like JSON Schema or OpenAPI, it is general-purpose and its most
          obvious application is as an IDL. However, those systems treat changing schemas as out of scope: a single
          version of a schema for some object is the atomic unit, and versioning is left to opaque strings in external
          systems like git or HTTP. Thema, by contrast, makes schema change a first-class system property: the atomic
          unit is the set of schema for some object, iteratively appended to over time as requirements evolve.
          <a
            className={styles.link}
            href={'https://github.com/grafana/thema#thema'}
            target={'_blank'}
            rel={'noreferrer noopener'}
          >
            Documentation
          </a>
          <a
            className={styles.link}
            href={'https://github.com/grafana/play-thema'}
            target={'_blank'}
            rel={'noreferrer noopener'}
          >
            Thema on Github
          </a>
        </Card.Description>
      </Card>
    </div>
  );
};

export const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      width: 33%;
      margin: ${theme.spacing(7, 2, 2, 2)};
    `,
    header: css`
      font-size: ${theme.typography.h4.fontSize} !important;
    `,
    link: css`
      display: block;
      margin-top: ${theme.spacing(2)};
      text-decoration: none;
      color: ${theme.colors.text.link};
    `,
  };
};
