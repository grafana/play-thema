import debounce from 'lodash.debounce';

import { useInputContext } from '../../state';
import { FileUpload } from '../FileUpload';
import CodeEditor from './index';

export const InputEditor = () => {
  const { input, setInput } = useInputContext();
  const debouncedSetInput = debounce((val?: string) => setInput(val || ''), 300);

  return (
    <FileUpload title={'JSON Input'} onInputRead={setInput} accept={'json'}>
      <CodeEditor value={input} language="json" onChange={debouncedSetInput} />
    </FileUpload>
  );
};
