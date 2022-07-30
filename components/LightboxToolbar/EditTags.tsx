import { ActionIcon, Tooltip } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { Edit, EditOff } from 'tabler-icons-react';

interface EditTagsProps {
  editingTags: boolean;
  setIconHover: Dispatch<SetStateAction<string>>;
  setEditingTags: Dispatch<SetStateAction<boolean>>;
  iconHover: string;
}

const EditTags = (props: EditTagsProps) => {
  return (
    <Tooltip
      key='edit_tags'
      label={!props.editingTags ? 'Edit Tags' : 'Stop Tagging'}
      withArrow
    >
      <ActionIcon
        component='div'
        variant='transparent'
        style={{
          margin: '10px 10px 0 0',
          cursor: 'pointer',
          filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
          color: props.iconHover === 'Edit' ? 'white' : '#cfcfcf',
        }}
      >
        {!props.editingTags ? (
          <Edit
            size={28}
            onMouseOver={() => props.setIconHover('Edit')}
            onMouseLeave={() => props.setIconHover('')}
            onClick={() => props.setEditingTags(true)}
          />
        ) : (
          <EditOff
            size={28}
            onMouseOver={() => props.setIconHover('Edit')}
            onMouseLeave={() => props.setIconHover('')}
            onClick={() => props.setEditingTags(false)}
          />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default EditTags;
