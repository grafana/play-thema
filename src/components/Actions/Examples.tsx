import { SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';

import { useInputContext, useLineageContext } from '../../state';
import { basic, lenses, multi } from './_examples';

const examples: Record<string, any> = {
  basic,
  multi,
  lenses,
};

const options = [
  { label: 'Basic example', value: 'basic' },
  { label: 'Multiple versions', value: 'multi' },
  { label: 'With lenses', value: 'lenses' },
];

const Examples = () => {
  const { setLineage } = useLineageContext();
  const { setInput } = useInputContext();

  const onExampleChange = (example: SelectableValue) => {
    const { lineage, input } = examples[example.value];
    setInput(input);
    setLineage(lineage);
  };

  return <Select width={20} options={options} placeholder={'Select example'} onChange={onExampleChange} />;
};

export default Examples;
