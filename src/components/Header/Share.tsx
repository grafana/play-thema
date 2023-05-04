import React, { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { fetchState, storeState } from '../../services/store';
import { StateContext } from '../../state';
import { publish } from '../../services/terminal';
import {Button, IconButton, Modal, TabContent} from "@grafana/ui";

const styles: { [name: string]: CSSProperties } = {
  btn: {
    margin: '6px 0',
  },
  input: {
    width: '250',
    fontSize: '15px',
    margin: '1px 0',
  },
};

const hashId = () => window.location.hash.slice(1);

const Share = () => {
  const { input, lineage, setInput, setLineage } = useContext(StateContext);
  const [shareId, setShareId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (hashId() === '') return;

    fetchState(hashId())
      .then(({ input, lineage }) => {
        setInput(input || '');
        setLineage(lineage || '');
        setShareId(hashId);
      })
      .catch((err: string) => publish({ stderr: err }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shareRef = useRef<HTMLInputElement>(null);

  const focusFn = () => {
    shareRef.current?.focus();
    shareRef.current?.setSelectionRange(0, shareRef.current.value.length);
  };

  const shareUrl = (share: string) => (share !== '' ? window.location.href.split('#')[0].concat(`#${share}`) : '');

  const shareFn = () => {
    storeState({ input, lineage }).then((id) => {
      setShareId(id);
      setTimeout(focusFn, 500);
      navigator.clipboard.writeText(shareUrl(id));
      window.location.href = shareUrl(id);
    });
  };

  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const toggleModelOpen = () => setModelOpen(!modelOpen);

  return (
    <>
      {/*<button style={styles.btn} onClick={shareFn}>*/}
      {/*  Share*/}
      {/*</button>*/}
      <IconButton name={"share-alt"} onClick={toggleModelOpen} size={"xl"} variant={"primary"} style={styles.btn} tooltip={"Share this code"} />
      {/*<input style={styles.input} ref={shareRef} onClick={focusFn} readOnly={true} value={shareUrl(shareId || '')} />*/}
      <ShareModal isOpen={modelOpen} onDismiss={toggleModelOpen}/>
    </>
  );
};

interface ShareModelProps {
  isOpen?: boolean;
  onDismiss?: () => void;
}

const ShareModal = ({isOpen, onDismiss}: ShareModelProps) =>
      <Modal className={"share-modal"} title="Something" isOpen={isOpen} onDismiss={onDismiss}>
        {"Text"}
        <Modal.ButtonRow>
          <Button> Copy </Button>
        </Modal.ButtonRow>
      </Modal>;


export default Share;
