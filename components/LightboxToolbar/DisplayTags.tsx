import { Tooltip } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { Tags, TagsOff } from 'tabler-icons-react';

interface DisplayTagsProps {
  showNameTags: boolean;
  setIconHover: Dispatch<SetStateAction<string>>;
  setShowNameTags: Dispatch<SetStateAction<boolean>>;
  iconHover: string;
}

const DisplayTags = (props: DisplayTagsProps) => {
  return (
    <Tooltip
      key='show_tags'
      label={props.showNameTags ? 'Hide Tags' : 'Show Tags'}
      withArrow
      zIndex={9999}
      style={{ margin: '10px 18px 0 0' }}
    >
      {props.showNameTags ? (
        <TagsOff
          size={28}
          onMouseOver={() => props.setIconHover('TagsOff')}
          onMouseLeave={() => props.setIconHover('')}
          onClick={() => props.setShowNameTags((prev) => !prev)}
          style={{
            cursor: 'pointer',
            filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
            color: props.iconHover === 'TagsOff' ? 'white' : '#cfcfcf',
          }}
        />
      ) : (
        <Tags
          size={28}
          onMouseOver={() => props.setIconHover('Tags')}
          onMouseLeave={() => props.setIconHover('')}
          onClick={() => props.setShowNameTags((prev) => !prev)}
          style={{
            cursor: 'pointer',
            filter: 'drop-shadow(2px 2px 4px rgb(0 0 0 / 0.65))',
            color: props.iconHover === 'Tags' ? 'white' : '#cfcfcf',
          }}
        />
      )}
    </Tooltip>
  );
};

export default DisplayTags;
