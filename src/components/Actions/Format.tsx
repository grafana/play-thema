import { Button } from '@grafana/ui';

import { tryOrReport } from '../../helpers';
import { fmtCue, fmtJson } from '../../services/format';
import { useInputContext, useLineageContext } from '../../state';

export function Format() {
  const { input, setInput } = useInputContext();
  const { lineage, setLineage } = useLineageContext();

  const formatFn = () => {
    tryOrReport(() => {
      setInput(fmtJson(input));
      setLineage(fmtCue(lineage));
    }, true);
  };

  return (
    <Button onClick={formatFn} variant={'secondary'}>
      Format
    </Button>
  );
}
