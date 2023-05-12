import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { Theme, useTheme } from '../../theme';

interface Props {
  value: string;
  onChange?: (value?: string) => void;
  isReadOnly?: boolean;
  language?: string;
}

const CodeEditor = ({ value, onChange, isReadOnly, language }: Props) => {
  // Monaco / Editor
  const editorRef = useRef<null | monaco.editor.IStandaloneCodeEditor>(null);
  const monacoRef = useRef<null | Monaco>(null);

  const theme = useTheme();
  const editorTheme = theme.name.toLowerCase() === Theme.dark ? 'thema-dark' : 'thema-light';

  useEffect(() => {
    if (theme.isDark) {
      monaco.editor.defineTheme('thema-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': theme.colors.background.secondary,
        },
      });
    } else {
      monaco.editor.defineTheme('thema-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#F4F5F5',
        },
      });
    }

    monaco.editor.setTheme(editorTheme);
  }, [theme]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('thema-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.colors.background.secondary,
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
  };

  const defaultOpts: monaco.editor.IStandaloneEditorConstructionOptions = {
    fontSize: 15,
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

  const opts = isReadOnly ? { ...defaultOpts, ...readOnlyOpts } : defaultOpts;

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
