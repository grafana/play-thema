import { css } from '@emotion/css';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { Button, Select } from '@grafana/ui';
import { useMemo, useState } from 'react';

import { TranslateToLatest, TranslateToVersion, ValidateAny, ValidateVersion, Versions } from '../../services/wasm';
import { useInputContext, useLineageContext } from '../../state';
import { useStyles } from '../../theme';

const options = [
  { label: 'Validate against schema', value: 'validate' },
  { label: 'Translate to schema', value: 'translate' },
];

const OpSelector = () => {
  const { input } = useInputContext();
  const { lineage } = useLineageContext();
  const [operation, setOperation] = useState<string>('validate');
  const [version, setVersion] = useState<string>(Versions(lineage)[0]);
  const styles = useStyles(getStyles);

  const getOperation = () => {
    if (operation === 'validate') {
      if (version === 'any') {
        return () => ValidateAny(lineage, input);
      }
      return () => ValidateVersion(lineage, input, version);
    } else {
      if (version === 'latest') {
        return () => TranslateToLatest(lineage, input);
      }
      return () => TranslateToVersion(lineage, input, version);
    }
  };

  const runOperation = () => {
    if (!operation) {
      return;
    }
    getOperation()();
  };

  return (
    <div className={styles.container}>
      <Select
        options={options}
        onChange={(op) => {
          setOperation(op.value!);
          setVersion(getDefaultVersion(op.value!).value);
        }}
        defaultValue={options[0]}
        placeholder={'Select operation'}
        width={40}
        className={styles.select}
      />
      <VersionsSelect
        key={operation}
        setVersion={setVersion}
        version={version}
        operation={operation}
        lineage={lineage}
      />
      <Button disabled={!operation} onClick={runOperation}>
        Run
      </Button>
    </div>
  );
};

export default OpSelector;

interface VersionsSelectProps {
  setVersion: (version: string) => void;
  version: string;
  operation: string;
  lineage: string;
}
const VersionsSelect = ({ setVersion, version, operation, lineage }: VersionsSelectProps) => {
  const styles = useStyles(getStyles);
  const onChange = (version: SelectableValue<string>) => {
    if (version?.value) {
      setVersion(version.value);
    }
  };

  const versionOptions = useMemo(() => {
    const versions: string[] = Versions(lineage);
    const opts = versions.map((v: string) => ({ label: v, value: v }));
    return [getDefaultVersion(operation), ...opts];
  }, [lineage, operation]);

  return (
    <Select
      className={styles.versionSelect}
      defaultValue={versionOptions[0]}
      placeholder={'Choose version'}
      options={versionOptions}
      onChange={onChange}
      value={version}
      width={20}
    />
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      & > * {
        margin-right: ${theme.spacing(2)};
      }
    `,
    select: css`
      max-width: 220px !important;
      min-width: 220px;
    `,
    versionSelect: css`
      max-width: 140px !important;
      min-width: 140px;
    `,
  };
};

const getDefaultVersion = (operation: string) => {
  return operation === 'validate'
    ? { label: 'Any version', value: 'any' }
    : { label: 'Latest version', value: 'latest' };
};
