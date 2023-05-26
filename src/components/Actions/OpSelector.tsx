import { css } from '@emotion/css';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { Button, Select } from '@grafana/ui';
import { useEffect, useMemo, useState } from 'react';

import { useDebounce } from '../../hooks';
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
  const [versions, setVersions] = useState<string[]>([]);
  const [operation, setOperation] = useState<string>('validate');
  const debouncedLineage: string = useDebounce<string>(lineage, 500);
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

  useEffect((): void => {
    const versions: string[] = Versions(debouncedLineage);

    setVersions(versions);
    setVersion(versions.length > 0 ? versions[0] : '');
  }, [debouncedLineage]);

  const versionDropDisabled = versions.length === 0;

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
        onChange={(op) => setOperation(op.value!)}
        defaultValue={options[0]}
        placeholder={'Select operation'}
        width={40}
        className={styles.select}
      />
      <VersionsSelect
        key={operation}
        setVersion={setVersion}
        disabled={versionDropDisabled}
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
  disabled: boolean;
  version: string;
  operation: string;
  lineage: string;
}
const VersionsSelect = ({ setVersion, disabled, version, operation, lineage }: VersionsSelectProps) => {
  const styles = useStyles(getStyles);
  const onChange = (version: SelectableValue<string>) => {
    if (version?.value) {
      setVersion(version.value);
    }
  };

  const versionOptions = useMemo(() => {
    const versions: string[] = Versions(lineage);
    const opts = versions.map((v: string) => ({ label: v, value: v }));
    if (operation === 'validate') {
      return [{ label: 'Any version', value: 'any' }, ...opts];
    } else if (operation === 'translate') {
      return [{ label: 'Latest version', value: 'latest' }, ...opts];
    }
    return opts;
  }, [lineage, operation]);

  return (
    <Select
      className={styles.versionSelect}
      defaultValue={versionOptions[0]}
      placeholder={'Choose version'}
      disabled={disabled}
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
