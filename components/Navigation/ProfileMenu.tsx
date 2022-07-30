import {
  ActionIcon,
  Avatar,
  Button,
  Menu,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { Logout } from 'tabler-icons-react';

import { Grad } from '../../types/User';
import LoginModal from '../Modal/LoginModal';

interface ProfileMenuProps {
  grads: Grad[];
}

const ProfileMenu = ({ grads }: ProfileMenuProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  //  Login
  const [value, setValue] = useState<string>('');
  const [opened, setOpened] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });
  const logoutClick = (): void => {
    setLoggedIn('');
    setValue('');
  };

  return (
    <>
      <LoginModal
        grads={grads}
        value={value}
        opened={opened}
        setLoggedIn={setLoggedIn}
        setOpened={setOpened}
        setValue={setValue}
      />
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size='xl'
        mr={loggedIn ? 0 : 10}
      >
        {colorScheme === 'dark' ? <MdOutlineLightMode /> : <MdDarkMode />}
      </ActionIcon>
      {loggedIn !== '' && loggedIn ? (
        <Menu position='top-end'>
          <Menu.Target>
            <Button
              p={0}
              variant={colorScheme === 'dark' ? 'subtle' : 'white'}
              styles={() => ({
                root: {
                  color: colorScheme === 'dark' ? '#d0cfd4' : '#3c4394',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',

                  '&:hover': {
                    backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : '',
                  },
                },
              })}
            >
              <Avatar radius='xl' color='indigo' ml={6} mr={2}>
                {JSON.parse(loggedIn).FullName.replace(/[^A-Z]/g, '')}
              </Avatar>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color='red'
              icon={<Logout size={14} />}
              onClick={logoutClick}
              style={{width: '110px'}}
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Button color='indigo' onClick={() => setOpened(true)}>
          Login
        </Button>
      )}
    </>
  );
};

export default ProfileMenu;
