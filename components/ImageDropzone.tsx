import { Center, Group, MantineTheme,Text } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';
import { Icon as TablerIcon,Photo, Upload, X } from 'tabler-icons-react';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

const ImageDropzone = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group
    position='center'
    spacing='xl'
    style={{ minHeight: 220, pointerEvents: 'none' }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <Center style={{flexDirection: 'column'}}>
      <Text size='xl' inline>
        Drag images here or click to select files
      </Text>
      <Text size='sm' color='dimmed' inline mt={7}>
        Attach as many photos you want to upload
      </Text>
    </Center>
  </Group>
);

export default ImageDropzone;
