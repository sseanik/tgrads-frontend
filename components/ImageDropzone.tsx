import { Center, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { Photo, Upload, X } from 'tabler-icons-react';

import { getIconColour } from '../utils/getIconColour';

const ImageDropzone = ({ imageCount }: { imageCount: number }) => {
  // Theme to determine current colour mode
  const theme = useMantineTheme();

  return (
    <Group
      position='center'
      spacing='xl'
      style={{ minHeight: 220, pointerEvents: 'none' }}
    >
      <Dropzone.Accept>
        <Upload style={{ color: getIconColour(true, theme) }} size={80} />
      </Dropzone.Accept>
      <Dropzone.Reject>
        <X style={{ color: getIconColour(false, theme) }} size={80} />
      </Dropzone.Reject>
      <Dropzone.Idle>
        <Photo style={{ color: getIconColour(true, theme) }} size={80} />
      </Dropzone.Idle>

      <Center style={{ flexDirection: 'column' }}>
        <Text size='xl' inline>
          {imageCount > 0
            ? `${imageCount} photo${imageCount > 1 ? 's' : ''} selected`
            : 'Drag images here or click to select files'}
        </Text>
        <Text size='sm' color='dimmed' inline mt={7}>
          Attach as many photos you want to upload
        </Text>
      </Center>
    </Group>
  );
};

export default ImageDropzone;
