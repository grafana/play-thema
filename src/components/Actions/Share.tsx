import { Button, InlineToast } from '@grafana/ui';
import React, { useEffect, useRef, useState } from 'react';

import { fetchState, storeState } from '../../services/store';
import { publish } from '../../services/terminal';
import { useInputContext, useLineageContext } from '../../state';

const hashId = () => window.location.hash.slice(1);

const Share = () => {
  const { input, setInput } = useInputContext();
  const { lineage, setLineage } = useLineageContext();
  const buttonRef = useRef(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const shareUrl = (share?: string) => (share !== '' ? window.location.href.split('#')[0].concat(`#${share}`) : '');

  useEffect(() => {
    if (hashId() === '') {
      return;
    }

    fetchState(hashId())
      .then(({ input, lineage }) => {
        setInput(input || '');
        setLineage(lineage || '');
      })
      .catch((err: string) => publish({ stderr: err }));
  }, [setInput, setLineage]);

  const shareFn = () => {
    storeState({ input, lineage }).then((id) => {
      window.location.href = shareUrl(id);
      setShowCopySuccess(true);
      navigator.clipboard.writeText(shareUrl(id));
      setTimeout(() => setShowCopySuccess(false), 5000);
    });
  };

  return (
    <>
      <Button ref={buttonRef} onClick={shareFn} variant={'secondary'} fill={'outline'}>
        Share
      </Button>
      {showCopySuccess && (
        <InlineToast placement="top" referenceElement={buttonRef.current}>
          URL copied!
        </InlineToast>
      )}
    </>
  );
};

export default Share;
