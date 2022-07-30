import { Button, MediaQuery, Tooltip, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { Icon } from 'tabler-icons-react';

export interface MenuButtonProps {
  icon?: Icon;
  text: string;
  url: string;
  title: string;
  state: string;
}

const MenuButton = (props: MenuButtonProps) => {
  const theme = useMantineTheme();

  return (
    <Link href={'/' + props.url} replace={true}>
      <a>
        <MediaQuery
          largerThan={theme.breakpoints.sm}
          styles={{ display: 'none' }}
        >
          <Tooltip
            label={props.text}
            color='indigo'
            position='bottom'
            withArrow
            style={{
              display: !props.state ? 'none' : undefined,
            }}
          >
            <Button
              styles={() => ({
                root: {
                  padding: '0 16px',
                  color: theme.colorScheme === 'dark' ? '#d0cfd4' : '#3c4394',
                  height: '100%',
                  backgroundImage:
                    theme.colorScheme === 'dark'
                      ? 'linear-gradient(45deg,  #d08dff 20%, #ada4ff 40%, #8687ff 60%)'
                      : 'linear-gradient(45deg,  #9546c1 20%, #5a46c1 40%, #5b6cf4 60%)',
                  backgroundSize: '0 4px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom',
                  transition: 'background-size 300ms',
                  '&:hover': {
                    backgroundSize: '100% 4px',
                    backgroundColor:
                      theme.colorScheme === 'dark' ? '#242936' : '',
                  },
                  '@media (max-width: 715px)': {
                    fontSize: 0,
                  },
                },
              })}
              radius='xs'
              variant='subtle'
              color='indigo'
              size='md'
              leftIcon={props.icon && <props.icon />}
            >
              {props.text}
            </Button>
          </Tooltip>
        </MediaQuery>
      </a>
    </Link>
  );
};

export default MenuButton;
