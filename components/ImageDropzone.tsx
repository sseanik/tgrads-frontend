import { Center, Group, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { Photo, Upload, X } from 'tabler-icons-react';

function getIconColor(status: boolean, theme: MantineTheme) {
  return status
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

interface ImageDropzoneProps {
  imageCount: number;
}

const ImageDropzone = ({ imageCount }: ImageDropzoneProps) => {
  const theme = useMantineTheme();

  return (
    <Group
      position='center'
      spacing='xl'
      style={{ minHeight: 220, pointerEvents: 'none' }}
    >
      <Dropzone.Accept>
        <Upload style={{ color: getIconColor(true, theme) }} size={80} />
      </Dropzone.Accept>
      <Dropzone.Reject>
        <X style={{ color: getIconColor(false, theme) }} size={80} />
      </Dropzone.Reject>
      <Dropzone.Idle>
        <Photo style={{ color: getIconColor(true, theme) }} size={80} />
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
