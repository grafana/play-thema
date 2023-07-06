import { ChangeEvent } from 'react';

import { useInputContext } from '../state';

export const FileUpload = () => {
  const { setInput } = useInputContext();
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setInput(text);
        } else {
          throw Error('Unsupported file type');
        }
      };
      reader.readAsText(file);
    }
  };
  return <input type={'file'} onChange={handleUpload} />;
};
