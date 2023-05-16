import { basic, lenses, multi } from './_examples';
import { useEffect, useState } from 'react';
import { useInputContext, useLineageContext } from '../../state';
import { Select } from '@grafana/ui';

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
  const [example, setExample] = useState<string>(Object.keys(examples)[0]);

  useEffect(() => {
    const { lineage, input } = examples[example];
    setInput(input);
    setLineage(lineage);
  }, [example, setInput, setLineage]);

  return (
    <Select
      width={20}
      options={options}
      defaultValue={options.find((opt) => opt.value === example)}
      onChange={(ex) => setExample(ex.value!)}
    />
  );
};

export default Examples;
