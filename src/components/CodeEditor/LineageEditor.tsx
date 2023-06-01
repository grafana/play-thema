import debounce from 'lodash.debounce';

import { useLineageContext } from '../../state';
import CodeEditor from './index';

export const LineageEditor = () => {
  const { lineage, setLineage } = useLineageContext();
  const debouncedSetLineage = debounce((val?: string) => setLineage(val || ''), 300);

  return <CodeEditor value={lineage} language="go" onChange={debouncedSetLineage} />;
};
