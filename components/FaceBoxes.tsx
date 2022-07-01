import { useMutation } from '@apollo/client';
import { Autocomplete, Menu, Tooltip, UnstyledButton } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Dispatch, SetStateAction } from 'react';
import { AlertCircle, FaceId } from 'tabler-icons-react';

import { UPDATE_PHOTO_TAGS } from '../graphql/mutations/photoTags';
import { ParsedPhoto } from '../types/Gallery';
import { FaceDetectionBox } from './PhotoGallery';

interface FaceBoxesProps {
  faceBoxes: FaceDetectionBox[];
  createdPhotoTagID: string;
  setFaceBoxes: Dispatch<SetStateAction<FaceDetectionBox[]>>;
  slug: string;
  selectedPhoto?: ParsedPhoto;
  showTags: boolean;
  showAllTags: boolean;
  names: string[]
}

let tagIncrement = 0;

const FaceBoxes = (props: FaceBoxesProps) => {
  const [updatePhotoTags, updatedPhotoTags] = useMutation(UPDATE_PHOTO_TAGS);

  const updateBoxNameTag = (name: string, faceBoxIndex: number) => {
    props.setFaceBoxes(
      props.faceBoxes.map((faceBox, idx) =>
        idx === faceBoxIndex ? { ...faceBox, name: name } : faceBox
      )
    );
  };

  const submitFaceTag = (name: string, faceBoxIndex: number) => {
    if (updatedPhotoTags.loading) {
      showNotification({
        id: 'tag-face-error',
        title: 'Error',
        message: 'Wait until current tag has finished',
        autoClose: 3000,
        color: 'orange',
        icon: <AlertCircle />,
      });
    } else {
      const increment = tagIncrement + 1;
      tagIncrement++;
      showNotification({
        id: `updating-face-tag-${increment}`,
        loading: true,
        title: 'Tagging',
        message: `Tagging ${name} in photo`,
        autoClose: false,
        disallowClose: true,
      });
      updatePhotoTags({
        variables: {
          id: props.createdPhotoTagID,
          photoID: props.selectedPhoto?.id,
          slug: props.slug,
          faceBoxes: JSON.stringify(
            JSON.stringify(
              props.faceBoxes.map((faceBox, idx) =>
                idx === faceBoxIndex ? { ...faceBox, name: name } : faceBox
              )
            )
          ),
        },
      }).then(() => {
        console.log('Added name to Photo tag');
        updateNotification({
          id: `updating-face-tag-${increment}`,
          color: 'green',
          title: 'Successful',
          message: `Successfully tagged ${name}`,
          icon: <FaceId />,
          autoClose: 2000,
        });
      });
    }
  };

  return (
    <>
      {props.faceBoxes.map((faceBox, faceBoxIndex) => {
        return (
          <Tooltip
            key={`face-${faceBoxIndex}`}
            style={{
              left: faceBox.left * (props.selectedPhoto?.width ?? 0),
              top: faceBox.top * (props.selectedPhoto?.height ?? 0),
              right:
                (props.selectedPhoto?.width ?? 0) -
                faceBox.right * (props.selectedPhoto?.width ?? 0),
              bottom:
                (props.selectedPhoto?.height ?? 0) -
                faceBox.bottom * (props.selectedPhoto?.height ?? 0),
              position: 'absolute',
              boxShadow: props.showTags
                ? '0 0 0 3px rgba(255, 255, 255, 0.5) inset'
                : '',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              cursor: props.showTags ? 'pointer' : '',
            }}
            label={faceBox.name}
            withArrow
            position='bottom'
            zIndex={9999}
            disabled={props.showTags || faceBox.name === ''}
            opened={props.showAllTags}
          >
            {props.showTags && (
              <Menu
                position='bottom'
                placement='center'
                zIndex={9999}
                size={150}
                withArrow
                transitionDuration={25}
                control={
                  <UnstyledButton
                    style={{
                      width:
                        (faceBox.right - faceBox.left) *
                        (props.selectedPhoto?.width ?? 0),
                      height: '100%',
                    }}
                  />
                }
              >
                <Autocomplete
                  zIndex={10000}
                  placeholder='Tag Person'
                  required
                  data={props.names}
                  value={faceBox.name}
                  onChange={(value) => updateBoxNameTag(value, faceBoxIndex)}
                  size='sm'
                  radius='sm'
                  onItemSubmit={(e) => submitFaceTag(e.value, faceBoxIndex)}
                  limit={5}
                />
              </Menu>
            )}
          </Tooltip>
        );
      })}
    </>
  );
};

export default FaceBoxes;
