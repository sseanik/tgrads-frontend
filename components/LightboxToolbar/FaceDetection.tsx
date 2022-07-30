import { ActionIcon, Loader, Tooltip } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { FaceId } from 'tabler-icons-react';

interface FaceDetectionProps {
  detectionLoading: boolean;
  setIconHover: Dispatch<SetStateAction<string>>;
  handleFaceDetection: () => void;
  iconHover: string;
}

const FaceDetection = (props: FaceDetectionProps) => {
  if (props.detectionLoading) {
    return (
      <Loader
        key='tag_photo_loading'
        color='white'
        size='sm'
        style={{
          margin: '14px 10px 0 0',
          filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
        }}
      />
    );
  }

  return (
    <Tooltip key='detect_faces' label='Detect Faces' withArrow>
      <ActionIcon
        component='div'
        variant='transparent'
        style={{
          cursor: 'pointer',
          filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
          color: props.iconHover === 'FaceId' ? 'white' : '#cfcfcf',
          margin: '10px 10px 0 0',
        }}
      >
        <FaceId
          size={28}
          onMouseOver={() => props.setIconHover('FaceId')}
          onMouseLeave={() => props.setIconHover('')}
          onClick={props.handleFaceDetection}
        />
      </ActionIcon>
    </Tooltip>
  );
};

export default FaceDetection;
