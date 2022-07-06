import {
  Avatar,
  Button,
  Divider,
  Menu,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import {
  BrightnessHalf,
  Login,
  Logout,
  Settings,
} from 'tabler-icons-react';

import LoginModalNSW from './LoginModalNSW';

interface ProfileMenuProps {
  names: string[];
}

const ProfileMenu = ({ names }: ProfileMenuProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // NSW Login
  const [valueNSW, setValueNSW] = useState<string>('');
  const [openedNSW, setOpenedNSW] = useState<boolean>(false);
  const [loggedInNSW, setLoggedInNSW] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });
  const logoutClick = (): void => {
    setLoggedInNSW('');
    setValueNSW('');
  };
  // Cruise Login
  const [openedCruise, setOpenedCruise] = useState<boolean>(false);

  return (
    <>
      <LoginModalNSW
        names={names}
        valueNSW={valueNSW}
        openedNSW={openedNSW}
        setLoggedInNSW={setLoggedInNSW}
        setOpenedNSW={setOpenedNSW}
        setValueNSW={setValueNSW}
      />
      <Menu
        control={
          <Button
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
            {loggedInNSW ? (
              <Avatar radius='xl' color='indigo'>
                {loggedInNSW.replace(/[^A-Z]/g, '')}
              </Avatar>
            ) : (
              <Avatar radius='xl' color='indigo' />
            )}
          </Button>
        }
        styles={() => ({
          body: {
            width: '150px',
          },
        })}
      >
        {loggedInNSW && (
          <Menu.Item icon={<Settings size={14} />}>Account</Menu.Item>
        )}
        <Menu.Item
          icon={<BrightnessHalf size={14} />}
          onClick={() => toggleColorScheme()}
        >
          {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
        </Menu.Item>

        <Divider />

        {loggedInNSW ? (
          <Menu.Item
            color='red'
            icon={<Logout size={14} />}
            onClick={logoutClick}
          >
            Sign Out
          </Menu.Item>
        ) : (
          <Menu.Item
            color='green'
            icon={<Login size={14} />}
            onClick={() => setOpenedNSW(true)}
          >
            NSW Login
          </Menu.Item>
        )}
      </Menu>
    </>
  );
};

export default ProfileMenu;
