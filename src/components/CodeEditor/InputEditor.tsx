import { useInputContext } from '../../state';
import CodeEditor from './index';

export const InputEditor = () => {
  const { input, setInput } = useInputContext();
  //@ts-ignore
  return <CodeEditor value={input} language="json" onChange={setInput} />;
};
