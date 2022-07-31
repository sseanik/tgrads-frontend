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

const ProfileMenu = ({ grads }: { grads: Grad[] }) => {
  // Current color scheme and function to toggle light/dark mode
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // Login input name
  const [loginName, setLoginName] = useState<string>('');
  // Login Modal opened state and toggle setter
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  // Local storage item to track and set logged in status
  const [loggedIn, setLoggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  // When logout button is clicked reset fields and logout
  const logoutClick = (): void => {
    setLoggedIn('');
    setLoginName('');
  };

  return (
    <>
      <LoginModal
        grads={grads}
        value={loginName}
        opened={modalOpened}
        setLoggedIn={setLoggedIn}
        setOpened={setModalOpened}
        setValue={setLoginName}
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
              style={{ width: '110px' }}
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Button color='indigo' onClick={() => setModalOpened(true)}>
          Login
        </Button>
      )}
    </>
  );
};

export default ProfileMenu;
