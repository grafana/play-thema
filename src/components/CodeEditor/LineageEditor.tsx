import debounce from 'lodash.debounce';

import { useLineageContext } from '../../state';
import { FileUpload } from '../FileUpload';
import CodeEditor from './index';

export const LineageEditor = () => {
  const { lineage, setLineage } = useLineageContext();
  const debouncedSetLineage = debounce((val?: string) => setLineage(val || ''), 300);

  return (
    <FileUpload title={'CUE Lineage'} onInputRead={setLineage} accept={'cue'}>
      <CodeEditor value={lineage} language="go" onChange={debouncedSetLineage} />
    </FileUpload>
  );
};
