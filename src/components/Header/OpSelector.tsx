import { TranslateToLatest, TranslateToVersion, ValidateAny, ValidateVersion, Versions } from '../../services/wasm';
import { useContext, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks';
import { StateContext } from '../../state';
import { Button, Select } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles } from '../../theme';

const options = [
  { label: 'Validate Any', value: 'validateAny' },
  { label: 'Validate Version', value: 'validateVersion' },
  { label: 'Translate to latest', value: 'translateToLatest' },
  { label: 'Translate to version', value: 'translateToVersion' },
];

const OpSelector = () => {
  const { lineage, input } = useContext(StateContext);
  const [version, setVersion] = useState<string>('');
  const [versions, setVersions] = useState<string[]>([]);
  const [operation, setOperation] = useState<string>();
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

  const versionDropDisabled = versions.length === 0 || operation === 'ValidateAny' || operation === 'TranslateToLatest';

  const runOperation = () => {
    if (!operation) {
      return;
    }
    operations[operation]();
  };

  return (
    <div className={styles.container}>
      <Select options={options} onChange={(op) => setOperation(op.value!)} placeholder={'Select operation'} />
      <Select
        placeholder={'Choose version'}
        disabled={versionDropDisabled}
        options={Versions(debouncedLineage).map((v) => ({ label: v, value: v }))}
        onChange={(ver) => setVersion(ver.value!)}
      />
      <Button disabled={!operation} onClick={runOperation}>
        Run
      </Button>
    </div>
  );
};

export default OpSelector;

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 450px;

      & > * {
        margin-right: ${theme.spacing(2)};
      }
    `,
  };
};
