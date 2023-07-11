import { css, cx } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { IconButton } from '@grafana/ui';
import { ChangeEvent, DragEvent, FC, ReactNode, useCallback, useRef, useState } from 'react';

import { useStyles } from '../theme';
import { H4 } from './Text/TextElements';

interface FileUploadProps {
  children: ReactNode;
  title: string;
  onInputRead: (input: string) => void;
  accept: string;
}

export const FileUpload: FC<FileUploadProps> = ({ children, title, onInputRead, accept }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const styles = useStyles(getStyles);

  const handleUpload = useCallback(
    (files: FileList) => {
      const file = files[0];

      const acceptedExtensions = accept.split(','); // Split the accept string into an array
      const extension = file.name.split('.').pop() || ''; // Get file extension

      // Check if the file has an accepted extension
      if (!acceptedExtensions.includes(extension)) {
        alert('Unsupported file type');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          onInputRead(text);
        } else {
          throw Error('Unsupported file type');
        }
      };
      reader.readAsText(file);
    },
    [onInputRead, accept]
  );

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleUpload(files);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={cx(styles.container, isDragOver ? styles.dropHover : '')}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className={styles.row}>
        <H4>{title}</H4>
        <IconButton name={'upload'} onClick={() => inputRef.current?.click()} tooltip={'Upload file'} />
      </div>
      {children}
      <input ref={inputRef} type={'file'} className={styles.fileInput} onChange={onFileChange} accept={accept} />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  row: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing(0, 1, 2, 2)};
  `,
  fileInput: css`
    display: none;
  `,
  container: css`
    padding-top: ${theme.spacing(2)};
    height: 100%;
    width: 100%;
    overflow: hidden;
  `,
  dropHover: css`
    border: 2px solid ${theme.colors.border.strong};
  `,
});
