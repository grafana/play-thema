import { TranslateToLatest, TranslateToVersion, ValidateAny, ValidateVersion, Versions } from '../../services/wasm';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks';
import { useInputContext, useLineageContext } from '../../state';
import { Button, Select } from '@grafana/ui';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles } from '../../theme';

const options = [
  { label: 'Validate Any', value: 'validateAny' },
  { label: 'Validate Version', value: 'validateVersion' },
  { label: 'Translate to latest', value: 'translateToLatest' },
  { label: 'Translate to version', value: 'translateToVersion' },
];

const OpSelector = () => {
  const { input } = useInputContext();
  const { lineage } = useLineageContext();
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

  const versionDropDisabled = versions.length === 0 || ['validateAny', 'translateToLatest'].includes(operation || '');

  const runOperation = () => {
    if (!operation) {
      return;
    }
    operations[operation]();
  };

  return (
    <div className={styles.container}>
      <Select options={options} onChange={(op) => setOperation(op.value!)} placeholder={'Select operation'} />
      <VersionsSelect setVersion={setVersion} disabled={versionDropDisabled} options={versions} />
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
}
const VersionsSelect = ({ setVersion, disabled, options }: VersionsSelectProps) => {
  const onChange = (version: SelectableValue<string>) => {
    if (version?.value) {
      setVersion(version.value);
    }
  };
  return (
    <Select
      placeholder={'Choose version'}
      disabled={disabled}
      options={options.map((v: string) => ({ label: v, value: v }))}
      onChange={onChange}
    />
  );
};

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
