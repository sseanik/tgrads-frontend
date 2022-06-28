import {
  Autocomplete,
  Avatar,
  Button,
  Center,
  Divider,
  Menu,
  Modal,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import { BrightnessHalf, Logout, Settings } from 'tabler-icons-react';
import { MoodHappy, MoodSad } from 'tabler-icons-react';

const ProfileMenu = () => {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [loggedIn, setLoggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const dark = colorScheme === 'dark';

  const data = [
    'Sean Smith',
    'Cynthia Mather',
    'Miro Macapagal',
    'Justin Kwon',
  ];
  const minData = value.length >= 3 ? data : [];

  const loginClick = () => {
    if (!data.includes(value)) {
      setError(true);
    } else {
      setLoggedIn(value);
      setOpened(false);
    }
  };

  const changeValue = (name: string) => {
    setValue(name);
    setError(false);
  };

  const logoutClick = () => {
    setLoggedIn('');
    setValue('');
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Text weight={700} size='lg'>
            Login
          </Text>
        }
        size='md'
      >
        <Autocomplete
          description='We use your name to login, no need to register'
          label='What is your name?'
          required
          data={minData}
          value={value}
          onChange={changeValue}
          size='md'
          radius='md'
          icon={error ? <MoodSad /> : <MoodHappy />}
          limit={3}
          error={error ? 'Name not found in Grad Program' : ''}
        />
        <Center>
          <Button
            size='md'
            mt={16}
            onClick={loginClick}
            style={{ width: '100%' }}
          >
            Login
          </Button>
        </Center>
      </Modal>
      <Menu
        control={
          <Button
            variant={dark ? 'subtle' : 'white'}
            styles={() => ({
              root: {
                color: dark ? '#d0cfd4' : '#3c4394',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                  backgroundColor: dark ? '#1a1b1e' : '',
                },
              },
            })}
          >
            <Text
              style={{ marginRight: '10px' }}
              styles={() => ({
                root: {
                  '@media (max-width: 755px)': {
                    fontSize: 0,
                  },
                },
              })}
            >
              {loggedIn}
            </Text>
            {loggedIn ? (
              <Avatar radius='xl' color='indigo'>
                CM
              </Avatar>
            ) : (
              <Avatar radius='xl' color='indigo' />
            )}
          </Button>
        }
        styles={() => ({
          body: {
            width: '140px',
          },
        })}
      >
        {loggedIn && (
          <Menu.Item icon={<Settings size={14} />}>Account</Menu.Item>
        )}
        <Menu.Item
          icon={<BrightnessHalf size={14} />}
          onClick={() => toggleColorScheme()}
        >
          {dark ? 'Light' : 'Dark'} Mode
        </Menu.Item>

        <Menu.Item color='Blue' icon={<Logout size={14} />}>
          Cruise Login
        </Menu.Item>
        <Divider />

        {loggedIn ? (
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
            icon={<Logout size={14} />}
            onClick={() => setOpened(true)}
          >
            NSW Login
          </Menu.Item>
        )}
      </Menu>
    </>
  );
};

export default ProfileMenu;
