import React, { useContext, useEffect, useRef, useState } from 'react';
import { fetchState, storeState } from '../../services/store';
import { StateContext } from '../../state';
import { publish } from '../../services/terminal';
import { Button, IconButton, Modal, Input, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

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

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);

  const shareRef = useRef<HTMLInputElement>(null);

  const shareUrl = (share?: string) => (share !== '' ? window.location.href.split('#')[0].concat(`#${share}`) : '');

  const shareFn = () => {
    storeState({ input, lineage }).then((id) => {
      toggleModalOpen();
      setShareId(id);
      window.location.href = shareUrl(id);
    });
  };

  const onFocus = () => {
    shareRef.current?.focus();
    shareRef.current?.setSelectionRange(0, shareRef.current.value.length);
  };

  const onCopy = () => {
    onFocus();

    const url = shareUrl(shareId);
    if (url !== '') {
      navigator.clipboard.writeText(url);
    }
  };

  const styles = useStyles2(getStyles);

  return (
    <>
      <div className={styles.iconContainer}>
        <IconButton name={'share-alt'} onClick={shareFn} size={'xl'} variant={'primary'} tooltip={'Share this code'} />
      </div>
      <Modal className={styles.modal} title="Share this code" isOpen={modalOpen} onDismiss={toggleModalOpen}>
        <div>Copy the following url to share your Thema Playground with the world:</div>
        <br />
        <Input ref={shareRef} onClick={onFocus} readOnly={true} value={shareUrl(shareId || '')} />
        <Modal.ButtonRow>
          <Button onClick={onCopy}>Copy</Button>
        </Modal.ButtonRow>
      </Modal>
    </>
  );
};

export default Share;

function getStyles(theme: GrafanaTheme2) {
  return {
    iconContainer: css`
      margin: 6px 0;
    `,
    modal: css`
      color: ${theme.colors.text.primary};
    `,
  };
}
