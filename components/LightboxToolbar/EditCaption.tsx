import { ActionIcon, Tooltip } from '@mantine/core';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TextRecognition } from 'tabler-icons-react';

import { ParsedPhoto } from '../../types/Gallery';
import CaptionModal from '../Modal/CaptionModal';

interface DisplayTagsProps {
  setIconHover: Dispatch<SetStateAction<string>>;
  iconHover: string;
  setSavedPhotos: Dispatch<SetStateAction<ParsedPhoto[]>>;
  currentPhoto: ParsedPhoto | undefined;
}

const EditCaption = (props: DisplayTagsProps) => {
  // Modal State
  const [modalOpened, setModalOpened] = useState(false);
  // Input caption value state
  const [value, setValue] = useState(props.currentPhoto?.description ?? '');

  return (
    <>
      <CaptionModal
        opened={modalOpened}
        setOpened={setModalOpened}
        value={value}
        setValue={setValue}
        currentPhoto={props.currentPhoto}
        setSavedPhotos={props.setSavedPhotos}
      />
      <Tooltip key='show_tags' label='Edit Caption' withArrow>
        <ActionIcon
          component='div'
          variant='transparent'
          style={{
            cursor: 'pointer',
            filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
            color: props.iconHover === 'Tags' ? 'white' : '#cfcfcf',
            margin: '10px 18px 0 0',
          }}
        >
          <TextRecognition
            size={28}
            onMouseOver={() => props.setIconHover('Tags')}
            onMouseLeave={() => props.setIconHover('')}
            onClick={() => {
              setModalOpened(true);
              setValue(props.currentPhoto?.description ?? '');
            }}
          />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export default EditCaption;
