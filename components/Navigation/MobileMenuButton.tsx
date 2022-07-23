import { Button, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { MenuButtonProps } from './MenuButton';

interface MobileMenuButtonProps {
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const MobileMenuButton = (props: MenuButtonProps & MobileMenuButtonProps) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Link href={'/' + props.url}>
      <Button
        onClick={() => {
          if (router.pathname === '/' + props.url) {
            props.setOpened(false);
          }
        }}
        styles={() => ({
          root: {
            color: theme.colorScheme === 'dark' ? '#d0cfd4' : '#3c4394',
            width: '100%',
            backgroundImage:
              theme.colorScheme === 'dark'
                ? 'linear-gradient(45deg,  #d08dff 20%, #ada4ff 40%, #8687ff 60%)'
                : 'linear-gradient(45deg,  #9546c1 20%, #5a46c1 40%, #5b6cf4 60%)',
            backgroundSize: '5px 0',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            '&:hover': {
              backgroundSize: '5px 100%',
              backgroundColor: theme.colorScheme === 'dark' ? '#242936' : '',
            },
            height: '50px',
          },
          inner: { justifyContent: 'flex-start' },
        })}
        radius='xs'
        variant='subtle'
        color='indigo'
        size='md'
        leftIcon={props.icon && <props.icon />}
      >
        {props.title}
      </Button>
    </Link>
  );
};

export default MobileMenuButton;
