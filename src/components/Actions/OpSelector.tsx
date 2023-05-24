import { css } from '@emotion/css';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { Button, Select } from '@grafana/ui';
import { useEffect, useState } from 'react';

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
  const [version, setVersion] = useState<string>('');
  const [versions, setVersions] = useState<string[]>([]);
  const [operation, setOperation] = useState<string>('validate');
  const debouncedLineage: string = useDebounce<string>(lineage, 500);
  const styles = useStyles(getStyles);

  const operations: { [name: string]: () => void } = {
    validateAny: () => ValidateAny(lineage, input),
    validateVersion: () => ValidateVersion(lineage, input, version),
    translateToLatest: () => TranslateToLatest(lineage, input),
    translateToVersion: () => TranslateToVersion(lineage, input, version),
  };

  useEffect((): void => {
    const versions: string[] = Versions(debouncedLineage);

    setVersions(versions);
    setVersion(versions.length > 0 ? versions[0] : '');
  }, [debouncedLineage]);

  const versionDropDisabled = versions.length === 0 || ['validateAny', 'translateToLatest'].includes(operation || '');

  const runOperation = () => {
    if (!operation) {
      return;
    }
    operations[operation]();
  };

  return (
    <div className={styles.container}>
      <Select
        options={options}
        onChange={(op) => setOperation(op.value!)}
        placeholder={'Select operation'}
        width={40}
        className={styles.select}
      />
      <VersionsSelect
        setVersion={setVersion}
        disabled={versionDropDisabled}
        options={versions}
        version={version}
        operation={operation}
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
  options: string[];
  version: string;
  operation: string;
}
const VersionsSelect = ({ setVersion, disabled, options, version, operation }: VersionsSelectProps) => {
  const styles = useStyles(getStyles);
  const onChange = (version: SelectableValue<string>) => {
    if (version?.value) {
      setVersion(version.value);
    }
  };

  let opts = options.map((v: string) => ({ label: v, value: v }));
  if (operation === 'validate') {
    opts = [{ label: 'Any version', value: 'any' }, ...opts];
  } else if (operation === 'translate') {
    opts = [{ label: 'Latest version', value: 'latest' }, ...opts];
  }

  return (
    <Select
      className={styles.versionSelect}
      placeholder={'Choose version'}
      disabled={disabled}
      options={opts}
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
