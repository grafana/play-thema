import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useCallback, useMemo, useRef } from 'react';

import { Theme, useTheme } from '../../theme';

const defaultOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 15,
  lineNumbersMinChars: 3,
  minimap: { enabled: false },
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
  },
};

const readOnlyOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  lineNumbers: 'off',
};

interface Props {
  value: string;
  onChange?: (value?: string) => void;
  isReadOnly?: boolean;
  language?: string;
}

const CodeEditor = ({ value, onChange, isReadOnly, language }: Props) => {
  const editorRef = useRef<null | monaco.editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<null | Monaco>(null);

  const theme = useTheme();
  const editorTheme = useMemo(() => (theme.name.toLowerCase() === Theme.dark ? 'thema-dark' : 'thema-light'), [theme]);

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      monaco.editor.defineTheme('thema-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#22252b',
        },
      });
      monaco.editor.defineTheme('thema-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#F4F5F5',
        },
      });
      monaco.editor.setTheme(editorTheme);

      editorRef.current = editor;
      monacoRef.current = monaco;
    },
    [editorTheme]
  );

  const opts = useMemo(() => (isReadOnly ? { ...defaultOpts, ...readOnlyOpts } : defaultOpts), [isReadOnly]);

  return (
    <Editor
      options={opts}
      theme={editorTheme}
      height="100%"
      value={value}
      defaultValue="..."
      defaultLanguage={language}
      onMount={handleEditorDidMount}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
