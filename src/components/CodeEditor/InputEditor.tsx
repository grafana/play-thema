import debounce from 'lodash.debounce';

import { useInputContext } from '../../state';
import CodeEditor from './index';

export const InputEditor = () => {
  const { input, setInput } = useInputContext();
  const debouncedSetInput = debounce((val?: string) => setInput(val || ''), 300);

  return <CodeEditor value={input} language="json" onChange={debouncedSetInput} />;
};
