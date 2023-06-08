import { SelectableValue } from '@grafana/data';
import { Button, Dropdown, Menu } from '@grafana/ui';
import { useState } from 'react';

import { useInputContext, useLineageContext } from '../../state';
import { basic, lenses, multi } from './_examples';

const examples: Record<string, any> = {
  basic,
  multi,
  lenses,
};

const options = [
  { label: 'Basic single-version lineage', value: 'basic' },
  { label: 'Multi-version lineage', value: 'multi' },
  { label: 'Using lenses', value: 'lenses' },
];

const Examples = () => {
  const { setLineage } = useLineageContext();
  const { setInput } = useInputContext();
  const [selected, setSelected] = useState('Load example');

  const onExampleChange = (example: SelectableValue) => {
    const { lineage, input } = examples[example.value];
    setSelected(example.label!);
    setInput(input);
    setLineage(lineage);
  };

  const menu = (
    <Menu>
      {options.map((opt) => (
        <Menu.Item key={opt.value} label={opt.label} onClick={() => onExampleChange(opt)} />
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button variant={'secondary'} fill={'outline'}>
        {selected}
      </Button>
    </Dropdown>
  );
};

export default Examples;
