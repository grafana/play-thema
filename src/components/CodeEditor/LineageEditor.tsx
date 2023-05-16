import { useLineageContext } from '../../state';
import CodeEditor from './index';

export const LineageEditor = () => {
  const { lineage, setLineage } = useLineageContext();
  //@ts-ignore
  return <CodeEditor value={lineage} language="go" onChange={setLineage} />;
};
