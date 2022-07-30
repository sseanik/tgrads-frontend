import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Center,
  Modal,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertCircle, TextRecognition } from 'tabler-icons-react';

import { UPDATE_PHOTO_CAPTION } from '../../graphql/mutations/uploadPhoto';
import { ParsedPhoto } from '../../types/Gallery';

interface DisplayTagsProps {
  setIconHover: Dispatch<SetStateAction<string>>;
  iconHover: string;
  setSavedPhotos: Dispatch<SetStateAction<ParsedPhoto[]>>;
  currentPhoto: ParsedPhoto | undefined;
}

const EditCaption = (props: DisplayTagsProps) => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState(props.currentPhoto?.description ?? '');
  const [updatePhotoCaption] = useMutation(UPDATE_PHOTO_CAPTION);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    showNotification({
      id: 'updating-caption',
      loading: true,
      title: 'Updating Caption',
      message: 'Updating photo caption',
      autoClose: false,
      disallowClose: true,
    });
    updatePhotoCaption({
      variables: {
        id: props.currentPhoto?.id,
        caption: value,
        alt: router.asPath
      },
    })
      .then(() => {
        setUploading(false);
        updateNotification({
          id: 'updating-caption',
          color: 'green',
          title: 'Successful',
          message: 'Successfully updated photo caption',
          icon: <TextRecognition />,
          autoClose: 2000,
        });
        props.setSavedPhotos((prevPhotos) => {
          const newPhotos = prevPhotos.map((photo) => {
            if (photo.id === props.currentPhoto?.id) {
              return {
                ...photo,
                description: value,
              };
            }
            return photo;
          });
          return newPhotos;
        });
      })
      .catch((e) => {
        setUploading(false);
        updateNotification({
          id: 'updating-caption',
          title: 'Error',
          message: `Error: ${e.message}`,
          autoClose: 3000,
          color: 'red',
          icon: <AlertCircle />,
        });
      });
  };

  return (
    <>
      <Modal
        style={{ marginLeft: '14px' }}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Text weight={700} size='lg'>
            Edit Caption
          </Text>
        }
        zIndex={9999}
        overlayColor='black'
        overlayOpacity={0.4}
      >
        <form onSubmit={onSubmit}>
          <TextInput
            required
            description='Photo Caption'
            mb={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Center>
            <Button
              size='md'
              mt={4}
              style={{ width: '100%' }}
              type='submit'
              color='indigo'
              loading={uploading}
            >
              Submit
            </Button>
          </Center>
        </form>
      </Modal>
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
              setOpened(true);
              setValue(props.currentPhoto?.description ?? '');
            }}
          />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export default EditCaption;
